use marked::NodeRef;

use crate::parse::Parser;
use crate::types::Kludge;

impl Parser {
    pub fn kludges(&self, root: NodeRef) -> Vec<Kludge> {
        root
            .select(|n| match n.attr("class") {
                Some(class) => class.to_string() == "attachment__link",
                None => false,
            })
            .filter_map(|n| match n.attr("href") {
                Some(href) => Some(Kludge::new(href.to_string())),
                None => None,
            })
            .collect::<Vec<_>>()
    }
}