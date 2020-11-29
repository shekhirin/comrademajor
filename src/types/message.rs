use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use crate::types::location::{LocationArray, Location};
use crate::js_array::binded::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Kludge {
    attachment_link: String
}

#[wasm_bindgen]
impl Kludge {
    #[wasm_bindgen(constructor)]
    pub fn new(attachment_link: String) -> Kludge {
        Kludge {
            attachment_link
        }
    }

    #[wasm_bindgen(getter, js_name = "attachmentLink")]
    pub fn attachment_link(&self) -> String {
        self.attachment_link.clone()
    }
}

crate::array!(Kludge, KludgeArray, "Array<Kludge>", KludgeWrapper);

#[wasm_bindgen]
pub struct Message {
    pub id: u32,
    dialog_name: String,
    author: Option<String>,
    author_url: Option<String>,
    text: String,
    kludges: Vec<Kludge>,
    highlighted_parts: Vec<Location>,
}

#[wasm_bindgen]
impl Message {
    #[wasm_bindgen(constructor)]
    pub fn new(id: u32, dialog_name: String, author: Option<String>, author_url: Option<String>, text: String, kludges: KludgeArray, highlighted_parts: LocationArray) -> Message {
        Message {
            id,
            dialog_name,
            author,
            author_url,
            text,
            kludges: kludges.to_vec(),
            highlighted_parts: highlighted_parts.to_vec(),
        }
    }

    #[wasm_bindgen(getter, js_name = "dialogName")]
    pub fn dialog_name(&self) -> String {
        self.dialog_name.clone()
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
    pub fn text(&self) -> String {
        self.text.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn kludges(&self) -> KludgeArray {
        self.kludges
            .clone()
            .to_js_array::<KludgeArray>()
    }

    #[wasm_bindgen(getter, js_name = "highlightedParts")]
    pub fn highlighted_parts(&self) -> LocationArray {
        self.highlighted_parts
            .clone()
            .to_js_array::<LocationArray>()
    }
}
