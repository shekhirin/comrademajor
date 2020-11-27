use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct File {
    data: Vec<u8>,
    pub kind: Kind,
}

#[wasm_bindgen]
impl File {
    #[wasm_bindgen(constructor)]
    pub fn new(data: Vec<u8>, kind: Kind) -> File {
        File {
            data,
            kind,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn data(&self) -> Vec<u8> {
        self.data.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_data(&mut self, data: Vec<u8>) {
        self.data = data
    }
}

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub enum Kind {
    Unknown,
    Comments
}