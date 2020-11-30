use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct Location {
    pub start: u32,
    pub end: u32,
}

crate::js_array!(LocationArray, "Array<Location>");
