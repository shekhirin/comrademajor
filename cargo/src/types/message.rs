use wasm_bindgen::prelude::*;

use crate::highlight::location::{Location, LocationArray};
use crate::js_array::binded::*;
use crate::types::{Kludge, KludgeArray};

#[wasm_bindgen]
#[derive(Clone)]
pub struct Message {
    pub id: u32,
    dialog_name: String,
    author: Option<String>,
    author_url: Option<String>,
    date: String,
    text: String,
    kludges: Vec<Kludge>,
    highlighted_parts: Vec<Location>,
}

impl Message {
    pub fn new(
        id: u32,
        dialog_name: String,
        author: Option<String>,
        author_url: Option<String>,
        date: String,
        text: String,
        kludges: Vec<Kludge>,
        highlighted_parts: Vec<Location>,
    ) -> Message {
        Message {
            id,
            dialog_name,
            author,
            author_url,
            date,
            text,
            kludges,
            highlighted_parts,
        }
    }
}

#[wasm_bindgen]
impl Message {
    #[wasm_bindgen(getter, js_name = "dialogName")]
    pub fn dialog_name(&self) -> String {
        self.dialog_name.to_string()
    }

    #[wasm_bindgen(getter)]
    pub fn author(&self) -> Option<String> {
        self.author.clone()
    }

    #[wasm_bindgen(getter, js_name = "authorURL")]
    pub fn author_url(&self) -> Option<String> {
        self.author_url.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn date(&self) -> String {
        self.date.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn text(&self) -> String {
        self.text.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn kludges(&self) -> KludgeArray {
        self.kludges.clone().to_js_array::<KludgeArray>()
    }

    #[wasm_bindgen(getter, js_name = "highlightedParts")]
    pub fn highlighted_parts(&self) -> LocationArray {
        self.highlighted_parts
            .clone()
            .to_js_array::<LocationArray>()
    }
}
