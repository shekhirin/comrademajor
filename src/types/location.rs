use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Location {
    pub start: u32,
    pub end: u32
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<Location>")]
    pub type LocationArray;
}

