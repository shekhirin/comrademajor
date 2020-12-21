use regex::Regex;

use crate::highlight::Highlighter;

pub struct Parser {
    pub highlighter: Highlighter,
    pub comments_url_split_re: Regex,
}

impl Parser {
    pub fn new(highlighter: Highlighter) -> Self {
        Parser {
            highlighter,
            comments_url_split_re: Regex::new(r".*/wall|\?reply=|&thread=").unwrap()
        }
    }
}