use crate::js_array::typed::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct File {
    data: Vec<u8>,
    path: Vec<String>,
    pub kind: Kind,
}

#[wasm_bindgen]
impl File {
    #[wasm_bindgen(constructor)]
    pub fn new(data: Vec<u8>, path: StringArray, kind: Kind) -> File {
        File {
            data,
            path: path.to_vec(),
            kind,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn data(&self) -> Vec<u8> {
        self.data.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn path(&self) -> StringArray {
        self.path.to_js_array()
    }
}

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub enum Kind {
    Unknown,
    Comments,
    Messages,
}
