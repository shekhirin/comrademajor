use marked::{html, NodeRef};
use web_sys::console;

use crate::highlight::gov::find_gov;
use crate::parse::parser::Parser;
use crate::types::Post;

impl Parser {
    pub fn wall(&self, root: NodeRef) -> Vec<Post> {
        root.select(|n| match n.attr("class") {
            Some(class) => class.to_string() == "item",
            None => false,
        })
            .filter_map(|item_node| {
                let items: Vec<_> = item_node
                    .select(|n| n.is_elem(html::t::DIV))
                    .collect();

                if items.len() != 3 {
                    return None;
                }

                let body_item = items[0];
                let link_item = items[1];
                let tertiary_item = items[2];

                let link = match link_item.find(|e| e.is_elem(html::t::A)) {
                    Some(link_node) => match link_node.attr("href") {
                        Some(link) => link.to_string(),
                        None => return None
                    },
                    None => return None
                };

                let (author, author_url, date) =
                    match tertiary_item.find(|e| e.is_elem(html::t::SPAN)) {
                        Some(tertiary) => {
                            let (author, author_url, date) = match self.header(tertiary) {
                                Some(header) => (header.author_name, header.author_url, header.date),
                                None => return None
                            };

                            (author, author_url, date)
                        }
                        None => return None
                    };

                let body_inner_item = match body_item.find_child(|e|
                    e.is_elem(html::t::DIV) && e.attr("class").is_none()
                ) {
                    Some(body_inner_item) => Some(body_inner_item),
                    None => None
                };

                let (text, highlighted_parts, kludges) = match body_inner_item {
                    Some(body_inner_item) => {
                        let text = body_inner_item
                            .children()
                            .next()
                            .and_then(|e| e.as_text().map(|e| e.to_string()));

                        let highlighted_parts = match &text {
                            Some(text) => Some(find_gov(text)),
                            None => None
                        };

                        let kludges = Some(self.kludges(body_inner_item));

                        (text, highlighted_parts, kludges)
                    }
                    None => (None, None, None)
                };

                let repost = match body_item
                    .find(|e| match e.attr("class") {
                        Some(class) => class.to_string() == "repost__post",
                        None => false
                    }) {
                    Some(repost_item) => {
                        let repost_children: Vec<_> = repost_item
                            .children()
                            .filter(|c| c.is_elem(html::t::DIV))
                            .collect();

                        match repost_children.len() > 1 {
                            true => {
                                let (owner, owner_url) =
                                    match repost_children[0]
                                        .find_child(|e| e.is_elem(html::t::A)) {
                                        Some(owner_link) => {
                                            match (owner_link.text(), owner_link.attr("href")) {
                                                (Some(owner), Some(owner_url)) =>
                                                    (Some(owner.to_string()), Some(owner_url.to_string())),
                                                _ => (None, None)
                                            }
                                        }
                                        None => (None, None)
                                    };

                                let text = match repost_children[1].text() {
                                    Some(text) => Some(text.to_string()),
                                    None => None
                                };

                                let highlighted_parts = match &text {
                                    Some(text) => Some(find_gov(&text)),
                                    None => None
                                };

                                let kludges = match repost_children.len() > 2 {
                                    true => Some(self.kludges(repost_children[2])),
                                    false => None
                                };

                                Some(Post::new(
                                    None,
                                    owner,
                                    owner_url,
                                    None,
                                    text,
                                    kludges,
                                    highlighted_parts,
                                    None,
                                ))
                            }
                            _ => None
                        }
                    }
                    None => None
                };

                if highlighted_parts.to_owned().unwrap_or_default().is_empty()
                    && repost.to_owned().and_then(|r| r.raw_highlighted_parts()).unwrap_or_default().is_empty() {
                    return None;
                }

                Some(Post::new(
                    Some(link),
                    author,
                    author_url,
                    Some(date),
                    text,
                    kludges,
                    highlighted_parts,
                    repost.map(Box::new),
                ))
            })
            .collect()
    }
}
