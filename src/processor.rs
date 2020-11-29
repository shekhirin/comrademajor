use wasm_bindgen::prelude::*;
use crate::types::comment::Comment;
use crate::types::message::Message;

#[wasm_bindgen(module = "/js/Processor.ts")]
extern "C" {
    pub type Processor;

    #[wasm_bindgen(method)]
    pub fn comment(this: &Processor, comment: Comment);

    #[wasm_bindgen(method)]
    pub fn message(this: &Processor, message: Message);
}