use regex::Regex;
use crate::highlight::location::Location;
use crate::highlight::extract::extract_locations;

lazy_static! {
    static ref SWEAR_RE: Regex = Regex::new(r"(?i)сук|пидор|пидр|пидар|хуй").unwrap();
}

pub fn find_swear(text: &str) -> Vec<Location> {
    extract_locations(&SWEAR_RE, text)
}