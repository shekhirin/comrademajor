use wasm_bindgen::prelude::*;
use crate::types::location::{LocationArray};
use wasm_bindgen::JsCast;

#[wasm_bindgen]
pub struct Comment {
    text: String,
    highlighted_parts: LocationArray,
    url: Option<String>
}

#[wasm_bindgen]
impl Comment {
    #[wasm_bindgen(constructor)]
    pub fn new(text: String, highlighted_parts: LocationArray, url: Option<String>) -> Comment {
        Comment {
            text,
            highlighted_parts,
            url
        }
    }

    #[wasm_bindgen(getter)]
    pub fn text(&self) -> String {
        self.text.clone()
    }

    #[wasm_bindgen(getter, js_name = "highlightedParts")]
    pub fn highlighted_parts(&self) -> LocationArray {
        self.highlighted_parts.clone().unchecked_into::<LocationArray>()
    }

    #[wasm_bindgen(getter)]
    pub fn url(&self) -> Option<String> {
        self.url.clone()
    }
}
