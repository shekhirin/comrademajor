use wasm_bindgen::prelude::*;

use crate::js_array::typed::*;

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
            path: path.into(),
            kind,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn data(&self) -> Vec<u8> {
        self.data.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn path(&self) -> StringArray {
        self.path.clone().into()
    }
}

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub enum Kind {
    Unknown,
    Comments,
    Messages,
}
