use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Kludge {
    attachment_link: String,
}

#[wasm_bindgen]
impl Kludge {
    #[wasm_bindgen(constructor)]
    pub fn new(attachment_link: String) -> Kludge {
        Kludge { attachment_link }
    }

    #[wasm_bindgen(getter, js_name = "attachmentLink")]
    pub fn attachment_link(&self) -> String {
        self.attachment_link.clone()
    }
}

crate::js_array!(KludgeArray, "Array<Kludge>");