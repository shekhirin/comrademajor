#[macro_use]
extern crate lazy_static;

use encoding_rs;
use marked::EncodingHint;
use marked::html;
use wasm_bindgen::prelude::*;

use file::File;
use processor::JsProcessor;

use crate::file::Kind;
use crate::parse::parser::Parser;
use crate::processor::Processor;

mod file;
mod highlight;
mod js_array;
mod parse;
mod processor;
mod types;

#[wasm_bindgen(start, skip_typescript)]
pub fn main_js() -> Result<(), JsValue> {
    #[cfg(debug_assertions)]
        console_error_panic_hook::set_once();

    Ok(())
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[allow(unused_macros)]
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen(js_name = processFile)]
pub async fn process_file(file: File, js_processor: JsProcessor) {
    let eh = EncodingHint::shared_default(encoding_rs::WINDOWS_1251);
    let doc = html::parse_buffered(eh, &mut file.data().as_slice()).unwrap();

    let root = doc.root_element_ref().unwrap();

    let processor: Processor = js_processor.into();
    let parser = Parser {};

    match file.kind {
        Kind::Unknown => {}
        Kind::Comments => parser
            .comments(root)
            .iter()
            .for_each(|comment| processor.comment(comment)),
        Kind::Messages => parser
            .messages(root)
            .iter()
            .for_each(|message| processor.message(message)),
    }
}
