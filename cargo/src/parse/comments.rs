use marked::{html, NodeRef};

use crate::highlight::Location;
use crate::parse::Parser;
use crate::types::Comment;
use crate::File;

impl Parser {
    pub fn comments(&self, file: File, root: NodeRef) -> Vec<Comment> {
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
                }.to_string();

                let url = match items[1].text().map(|url| url.to_string()) {
                    Some(url) => url,
                    None => return None
                };

                let id = self.comments_url_split_re.split(url.as_str()).collect::<Vec<_>>().join("-");

                let attachment = items[2]
                    .text()
                    .map(|attachment| attachment.to_string());

                let date = items[3].text().map(|date| date.to_string());

                let highlighted_parts: Vec<Location> = self.highlighter.highlight(text.as_ref());
                if highlighted_parts.is_empty() {
                    return None;
                }

                Some(Comment::new(
                    id,
                    text,
                    highlighted_parts,
                    url,
                ))
            })
            .collect()
    }
}
