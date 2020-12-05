use regex::Regex;

use crate::highlight::extract::extract_locations;
use crate::highlight::location::{Kind, Location};

lazy_static! {
    static ref GOV_RE: Regex = Regex::new(r"(?i)путин|навальн").unwrap();
}

pub fn find_gov(text: &str) -> Vec<Location> {
    extract_locations(&GOV_RE, Kind::GOV, text)
}