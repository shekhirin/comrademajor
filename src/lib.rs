#[macro_use]
extern crate lazy_static;

mod file;
mod types;
mod processor;
mod js_array;

use file::File;
use wasm_bindgen::prelude::*;
use encoding_rs;
use marked::{EncodingHint, NodeRef};
use marked::html;
use crate::file::Kind;
use processor::Processor;
use crate::types::comment::Comment;
use crate::types::location::{Location, LocationArray};
use regex::Regex;
use crate::types::message::{Message, KludgeArray, Kludge};
use crate::js_array::binded::*;

lazy_static! {
    static ref SWEAR_RE: Regex = Regex::new(r"(?i)сук|пидор|пидр|пидар|хуй").unwrap();
}

#[wasm_bindgen(start, skip_typescript)]
pub fn main_js() -> Result<(), JsValue> {
    #[cfg(debug_assertions)]
        console_error_panic_hook::set_once();

    Ok(())
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[allow(unused_macros)]
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen(js_name = processFile)]
pub async fn process_file(file: File, processor: Processor) {
    let eh = EncodingHint::shared_default(encoding_rs::WINDOWS_1251);
    let doc = html::parse_buffered(eh, &mut file.data().as_slice()).unwrap();

    let root = doc.root_element_ref().unwrap();

    match file.kind {
        Kind::Unknown => {}
        Kind::Comments => process_comments(root, processor),
        Kind::Messages => process_messages(root, processor)
    }
}

fn process_comments(root: NodeRef, processor: Processor) {
    root
        .select(|n| {
            match n.attr("class") {
                Some(class) => class.to_string() == "item",
                None => false
            }
        })
        .filter_map(|comment_node| {
            let items = comment_node
                .select(|n| {
                    n.is_elem(html::t::DIV)
                })
                .collect::<Vec<_>>();

            let text = match items[0].text() {
                Some(text) => text.to_string(),
                None => return None
            };
            let url = items[1]
                .text()
                .and_then(|url| Some(url.to_string()));
            let _attachment = items[2]
                .text()
                .and_then(|attachment| Some(attachment.to_string()));
            let _date = items[3]
                .text()
                .and_then(|date| Some(date.to_string()));

            let highlighted_parts: Vec<Location> = extract_highlighted_parts(text.as_ref());
            if highlighted_parts.is_empty() {
                return None;
            }

            Some(Comment::new(
                text.to_string(),
                highlighted_parts.to_js_array::<LocationArray>(),
                url,
            ))
        })
        .for_each(|comment| processor.comment(comment))
}

fn process_messages(root: NodeRef, processor: Processor) {
    let ui_crumb = root.select(|n| match n.attr("class") {
        Some(class) => class.to_string() == "ui_crumb",
        None => false
    }).last();
    let dialog_name = match ui_crumb.and_then(|uc| uc.text()) {
        Some(name) => name,
        None => return
    };

    root
        .select(|n| {
            match n.attr("class") {
                Some(class) => class.to_string() == "message",
                None => false
            }
        })
        .filter_map(|message_node| {
            let id = match message_node
                .attr("data-id")
                .and_then(|id| id.to_string().parse::<u32>().ok()) {
                Some(id) => id,
                None => return None
            };

            let items = message_node
                .select(|n| {
                    n.is_elem(html::t::DIV)
                })
                .collect::<Vec<_>>();

            if items.len() != 2 {
                return None;
            }

            let header = items[0];
            let body = items[1];

            let (author, author_url) = match header.children().next() {
                Some(a) => {
                    match (a.text(), a.attr("href")) {
                        (Some(author), Some(author_url)) => (Some(author.to_string()), Some(author_url.to_string())),
                        _ => (None, None)
                    }
                }
                None => (None, None)
            };

            let text = match body.text() {
                Some(text) => text.to_string(),
                None => return None
            };

            let highlighted_parts: Vec<Location> = extract_highlighted_parts(&text);
            if highlighted_parts.is_empty() {
                return None;
            }

            let kludges = body
                .select(|n| match n.attr("class") {
                    Some(class) => class.to_string() == "attachment__link",
                    None => false
                })
                .filter_map(|n| match n.attr("href") {
                    Some(href) => Some(Kludge::new(href.to_string())),
                    None => None
                })
                .collect::<Vec<_>>();

            Some(Message::new(
                id,
                dialog_name.to_string(),
                author,
                author_url,
                text,
                kludges.to_js_array::<KludgeArray>(),
                highlighted_parts.to_js_array::<LocationArray>(),
            ))
        })
        .for_each(|message| processor.message(message))
}

fn extract_highlighted_parts(text: &str) -> Vec<Location> {
    SWEAR_RE
        .find_iter(text)
        .map(|m| {
            let (mut start, mut end) = (0, 0);
            let mut i = 0;
            text.chars().enumerate().for_each(|(idx, c)| {
                if i == m.start() {
                    start = idx;
                }
                if i == m.end() {
                    end = idx;
                }
                i += c.len_utf8();
            });
            if i == m.end() {
                end = text.chars().count()
            }

            Location {
                start: start as u32,
                end: end as u32,
            }
        })
        .collect::<Vec<_>>()
}
