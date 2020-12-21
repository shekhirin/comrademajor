use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "HighlightKind")]
#[derive(Copy, Clone)]
pub enum Kind {
    GOV,
    DRUGS,
}