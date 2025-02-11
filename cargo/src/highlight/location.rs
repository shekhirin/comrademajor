use wasm_bindgen::prelude::*;
use crate::highlight::Kind;

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct Location {
    pub start: u32,
    pub end: u32,
    pub kind: Kind,
}

crate::js_array!(LocationArray, "Array<Location>");