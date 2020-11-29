use crate::highlight::location::Location;
use crate::highlight::swear::find_swear;
use crate::parse::parser::Parser;
use crate::types::Comment;
use marked::{html, NodeRef};

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
            let url = items[1].text().and_then(|url| Some(url.to_string()));
            let _attachment = items[2]
                .text()
                .and_then(|attachment| Some(attachment.to_string()));
            let _date = items[3].text().and_then(|date| Some(date.to_string()));

            let highlighted_parts: Vec<Location> = find_swear(text.as_ref());
            if highlighted_parts.is_empty() {
                return None;
            }

            Some(Comment::new(text, highlighted_parts, url))
        })
        .collect()
    }
}
