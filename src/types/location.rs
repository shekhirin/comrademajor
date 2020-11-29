use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use js_sys;

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct Location {
    pub start: u32,
    pub end: u32
}

crate::array!(Location, LocationArray, "Array<Location>", LocationWrapper);