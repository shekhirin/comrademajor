use marked::{html, NodeRef};

use wasm_bindgen::prelude::*;

use crate::highlight::location::Location;
use crate::highlight::swear::find_swear;
use crate::parse::parser::Parser;
use crate::types::{Kludge, Message};



#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[allow(unused_macros)]
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

impl Parser {
    pub fn messages(&self, root: NodeRef) -> Vec<Message> {
        let ui_crumb = root
            .select(|n| match n.attr("class") {
                Some(class) => class.to_string() == "ui_crumb",
                None => false,
            })
            .last();
        let dialog_name = match ui_crumb.and_then(|uc| uc.text()) {
            Some(name) => name,
            None => return vec![],
        };

        root.select(|n| match n.attr("class") {
            Some(class) => class.to_string() == "message",
            None => false,
        })
            .filter_map(|message_node| {
                let id = match message_node
                    .attr("data-id")
                    .and_then(|id| id.to_string().parse::<u32>().ok())
                {
                    Some(id) => id,
                    None => return None,
                };

                let items: Vec<_> = message_node
                    .select(|n| n.is_elem(html::t::DIV))
                    .collect();

                if items.len() != 2 {
                    return None;
                }

                let header = items[0];
                let body = items[1];

                let header_children: Vec<_> = header.children().collect();

                let (author, author_url, date_node) = match header_children.len() {
                    1 =>
                        (None, None, header_children[0].as_text()),
                    2 => {
                        let author_node = header_children[0];
                        let (author, author_url) = match (author_node.text(), author_node.attr("href")) {
                            (Some(a), Some(a_url)) =>
                                (Some(a.to_string()), Some(a_url.to_string())),
                            _ => return None
                        };

                        (author, author_url, header_children[1].as_text())
                    },
                    _ => return None
                };

                let date = match date_node {
                    Some(date) => date.to_string(),
                    None => return None
                };

                let body_text = body.children().next();
                let text = match body_text {
                    Some(body_text) => match body_text.as_text() {
                        Some(text) => text.to_string(),
                        None => return None
                    },
                    None => return None,
                };

                let highlighted_parts: Vec<Location> = find_swear(&text);
                if highlighted_parts.is_empty() {
                    return None;
                }

                let kludges = body
                    .select(|n| match n.attr("class") {
                        Some(class) => class.to_string() == "attachment__link",
                        None => false,
                    })
                    .filter_map(|n| match n.attr("href") {
                        Some(href) => Some(Kludge::new(href.to_string())),
                        None => None,
                    })
                    .collect::<Vec<_>>();

                Some(Message::new(
                    id,
                    dialog_name.to_string(),
                    author,
                    author_url,
                    date,
                    text,
                    kludges,
                    highlighted_parts,
                ))
            })
            .collect()
    }
}
