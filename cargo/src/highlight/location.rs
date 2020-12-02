use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct Location {
    pub start: u32,
    pub end: u32,
    pub kind: Kind
}

crate::js_array!(LocationArray, "Array<Location>");

#[wasm_bindgen(js_name = "LocationKind")]
#[derive(Copy, Clone)]
pub enum Kind {
    SWEAR
}