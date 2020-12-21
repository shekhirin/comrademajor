use crate::highlight::{Finder, Kind, Location};

pub struct Highlighter {
    pub kinds: Vec<Kind>,
    pub finder: Finder,
}

impl Highlighter {
    pub fn highlight(&self, text: &str) -> Vec<Location> {
        self.kinds
            .iter()
            .flat_map(|kind| self.finder.for_kind(*kind, text))
            .collect()
    }
}