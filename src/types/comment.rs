use wasm_bindgen::prelude::*;

use crate::highlight::location::{Location, LocationArray};
use crate::js_array::binded::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Comment {
    text: String,
    highlighted_parts: Vec<Location>,
    url: Option<String>,
}

impl Comment {
    pub fn new(text: String, highlighted_parts: Vec<Location>, url: Option<String>) -> Comment {
        Comment {
            text,
            highlighted_parts,
            url,
        }
    }
}

#[wasm_bindgen]
impl Comment {
    #[wasm_bindgen(getter)]
    pub fn text(&self) -> String {
        self.text.clone()
    }

    #[wasm_bindgen(getter, js_name = "highlightedParts")]
    pub fn highlighted_parts(&self) -> LocationArray {
        self.highlighted_parts
            .clone()
            .to_js_array::<LocationArray>()
    }

    #[wasm_bindgen(getter)]
    pub fn url(&self) -> Option<String> {
        self.url.clone()
    }
}
