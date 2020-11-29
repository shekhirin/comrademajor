use crate::parse::parser::Parser;
use crate::types::{Message, Kludge};
use marked::{NodeRef, html};
use crate::highlight::swear::find_swear;
use crate::highlight::location::Location;

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

            let items = message_node
                .select(|n| n.is_elem(html::t::DIV))
                .collect::<Vec<_>>();

            if items.len() != 2 {
                return None;
            }

            let header = items[0];
            let body = items[1];

            let (author, author_url) = match header.children().next() {
                Some(a) => match (a.text(), a.attr("href")) {
                    (Some(author), Some(author_url)) => {
                        (Some(author.to_string()), Some(author_url.to_string()))
                    }
                    _ => (None, None),
                },
                None => (None, None),
            };

            let text = match body.text() {
                Some(text) => text.to_string(),
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
                text,
                kludges,
                highlighted_parts,
            ))
        })
        .collect()
    }
}
