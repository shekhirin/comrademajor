use wasm_bindgen::prelude::*;
use crate::types::comment::Comment;

#[wasm_bindgen(module = "/js/Processor.ts")]
extern "C" {
    pub type Processor;

    #[wasm_bindgen(method)]
    pub fn comment(this: &Processor, comment: Comment);
}