use marked::NodeRef;
use crate::parse::Parser;

pub struct Header {
    pub author_url: Option<String>,
    pub author_name: Option<String>,
    pub date: String
}

impl Parser {
    pub fn header(&self, root: NodeRef) -> Option<Header> {
        let children: Vec<_> = root.children().collect();

        let (author_name, author_url, date_node) = match children.len() {
            1 => {
                let date_node = children[0].as_text();

                (None, None, date_node)
            },
            2 => {
                let author_node = children[0];

                let author_name = author_node
                    .text()
                    .map(|e| e.to_string());
                let author_url = author_node
                    .attr("href")
                    .map(|e| e.to_string());
                let date_node = children[1].as_text();

                (author_name, author_url, date_node)
            }
            _ => return None
        };

        let date = match date_node {
            Some(date) => date.to_string(),
            None => return None
        };

        Some(Header{
            author_url,
            author_name,
            date
        })
    }
}