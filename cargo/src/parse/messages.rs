use marked::{html, NodeRef};

use crate::File;
use crate::highlight::Location;
use crate::parse::Parser;
use crate::types::Message;

impl Parser {
    pub fn messages(&self, file: File, root: NodeRef) -> Vec<Message> {
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

                let (author, author_url, date) = match self.header(header) {
                    Some(header) => (header.author_name, header.author_url, header.date),
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

                let highlighted_parts: Vec<Location> = self.highlighter.highlight(&text);
                if highlighted_parts.is_empty() {
                    return None;
                }

                let kludges = self.kludges(body);

                let dialog_id = match file.raw_path()[file.raw_path().len()-2].parse::<i32>() {
                    Ok(dialog_id) => dialog_id,
                    Err(_) => return None
                };

                let url = format!("https://vk.com/im?msgid={}&sel={}", id, dialog_id);

                Some(Message::new(
                    id.to_string(),
                    dialog_name.to_string(),
                    author,
                    author_url,
                    date,
                    text,
                    kludges,
                    highlighted_parts,
                    url,
                ))
            })
            .collect()
    }
}
