use marked::{html, NodeRef};

use crate::highlight::gov::find_gov;
use crate::highlight::location::Location;
use crate::parse::parser::Parser;
use crate::types::Comment;

impl Parser {
    pub fn comments(&self, root: NodeRef) -> Vec<Comment> {
        root.select(|n| match n.attr("class") {
            Some(class) => class.to_string() == "item",
            None => false,
        })
            .filter_map(|comment_node| {
                let items = comment_node
                    .select(|n| n.is_elem(html::t::DIV))
                    .collect::<Vec<_>>();

                let text = match items[0].text() {
                    Some(text) => text.to_string(),
                    None => return None,
                }
                    .to_string();
                let url = items[1].text().map(|url| url.to_string());
                let _attachment = items[2]
                    .text()
                    .map(|attachment| attachment.to_string());
                let _date = items[3].text().map(|date| date.to_string());

                let highlighted_parts: Vec<Location> = find_gov(text.as_ref());
                if highlighted_parts.is_empty() {
                    return None;
                }

                Some(Comment::new(text, highlighted_parts, url))
            })
            .collect()
    }
}
