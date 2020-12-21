#[macro_use]
extern crate lazy_static;

use encoding_rs;
use marked::EncodingHint;
use marked::html;
use wasm_bindgen::JsCast;
use wasm_bindgen::prelude::*;

use file::{File, Kind};
use highlight::{Finder, Highlighter, Kind as HighlightKind};
use parse::Parser;
use processor::{JsProcessor, Processor};

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
pub struct ComradeMajor {
    parser: Parser
}

#[wasm_bindgen]
impl ComradeMajor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        ComradeMajor {
            parser: Parser::new(
                Highlighter {
                    kinds: vec![
                        HighlightKind::DRUGS,
                        // HighlightKind::GOV
                    ],
                    finder: Finder::new(),
                }
            )
        }
    }

    #[wasm_bindgen(js_name = processFile)]
    pub fn process_file(&self, file: File, js_processor: JsProcessor) {
        let eh = EncodingHint::shared_default(encoding_rs::WINDOWS_1251);
        let doc = html::parse_buffered(eh, &mut file.data().as_slice()).unwrap();

        let root = doc.root_element_ref().unwrap();

        let processor: Processor = js_processor.into();

        match file.kind {
            Kind::Unknown => {}
            Kind::Comments => self.parser
                .comments(file, root)
                .iter()
                .for_each(|comment| processor.comment(comment)),
            Kind::Messages => self.parser
                .messages(file, root)
                .iter()
                .for_each(|message| processor.message(message)),
            Kind::Wall => self.parser
                .wall(file, root)
                .iter()
                .for_each(|post| processor.post(post))
        }
    }
}
