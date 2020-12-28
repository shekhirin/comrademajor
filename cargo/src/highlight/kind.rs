use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "HighlightKind")]
#[derive(Copy, Clone)]
pub enum Kind {
    GOV,
    DRUGS,
}

#[wasm_bindgen(js_name = highlightKindToString)]
pub fn kind_to_string(kind: Kind) -> String {
    match kind {
        Kind::GOV => "Government",
        Kind::DRUGS => "Drugs"
    }.to_string()
}