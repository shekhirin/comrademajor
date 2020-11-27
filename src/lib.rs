#[macro_use]
extern crate lazy_static;

mod file;
mod types;

use file::File;
use wasm_bindgen::prelude::*;
use encoding_rs;
use marked::{EncodingHint, NodeRef, Node};
use marked::html;
use crate::file::Kind;
use crate::types::processor::Processor;
use crate::types::comment::Comment;
use crate::types::location::{Location, LocationArray};
use js_sys;
use wasm_bindgen::JsCast;
use regex::Regex;
use std::ops::Range;

lazy_static! {
    static ref SWEAR_RE: Regex = Regex::new(r"(?i)дурак").unwrap();
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
        Kind::Comments => process_comments(root, processor)
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
            let attachment = items[2]
                .text()
                .and_then(|attachment| Some(attachment.to_string()));
            let date = items[3]
                .text()
                .and_then(|date| Some(date.to_string()));

            let highlighted_parts: Vec<Location> = extract_highlighted_parts(text.as_ref());
            if highlighted_parts.is_empty() {
                return None;
            }

            Some(Comment::new(
                text.to_string(),
                highlighted_parts
                    .into_iter()
                    .map(JsValue::from)
                    .collect::<js_sys::Array>()
                    .unchecked_into::<LocationArray>(),
                url,
            ))
        })
        .for_each(|comment| processor.comment(comment))
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