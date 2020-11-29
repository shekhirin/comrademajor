use crate::types::*;
use wasm_bindgen::prelude::*;

macro_rules! processor_methods {
    ($(($name:ident,$type:ty))*) => (
        #[wasm_bindgen(module = "/js/Processor.ts")]
        extern "C" {
            $(
                #[wasm_bindgen(method)]
                fn $name(this: &JsProcessor, $name: $type);
            )*
        }

        impl Processor {
            $(
                pub fn $name(&self, $name: &$type) {
                    self.js_processor.$name($name.clone())
                }
            )*
        }
    );
}

#[wasm_bindgen(module = "/js/Processor.ts")]
extern "C" {
    pub type JsProcessor;
}

processor_methods! {
    (comment, Comment)
    (message, Message)
}

pub struct Processor {
    js_processor: JsProcessor,
}

impl From<JsProcessor> for Processor {
    fn from(js_processor: JsProcessor) -> Self {
        Processor { js_processor }
    }
}
