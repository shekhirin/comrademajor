use regex::Regex;
use crate::highlight::regexes;

use crate::highlight::{Kind, Location};

pub struct Finder {
    drugs_re: Regex,
    gov_re: Regex,
}

impl Finder {
    pub fn new() -> Self {
        Finder {
            drugs_re: Regex::new(&regexes::DRUGS_RE).unwrap(),
            gov_re: Regex::new(&regexes::GOV_RE).unwrap(),
        }
    }

    pub fn for_kind(&self, kind: Kind, text: &str) -> Vec<Location> {
        match kind {
            Kind::GOV => self.extract_locations(&self.gov_re, kind, text),
            Kind::DRUGS => self.extract_locations(&self.drugs_re, kind, text)
        }
    }

    fn extract_locations(&self, re: &Regex, kind: Kind, text: &str) -> Vec<Location> {
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
}
