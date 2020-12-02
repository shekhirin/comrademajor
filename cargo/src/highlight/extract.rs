use regex::Regex;

use crate::highlight::location::{Kind, Location};

pub fn extract_locations(re: &Regex, kind: Kind, text: &str) -> Vec<Location> {
    re.find_iter(text)
        .map(|m| {
            let (mut start, mut end) = (0, 0);
            let mut i = 0;
            text.chars().enumerate().for_each(|(idx, c)| {
                if i == m.start() {
                    start = idx;
                }
                if i == m.end() {
                    end = idx;
                }
                i += c.len_utf8();
            });
            if i == m.end() {
                end = text.chars().count()
            }

            Location {
                start: start as u32,
                end: end as u32,
                kind,
            }
        })
        .collect::<Vec<_>>()
}
