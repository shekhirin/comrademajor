use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

pub trait TypedJsArray<T> {
    type OutputArray: JsCast;
    fn to_js_array(&self) -> Self::OutputArray;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<string>")]
    pub type StringArray;
}

impl TypedJsArray<String> for Vec<String> {
    type OutputArray = StringArray;
    fn to_js_array(&self) -> StringArray {
        self
            .iter()
            .map(JsValue::from)
            .collect::<js_sys::Array>()
            .unchecked_into::<StringArray>()
    }
}

impl StringArray {
    pub fn to_vec(&self) -> Vec<String> {
        js_sys::Array::from(&JsValue::from(self))
            .iter()
            .map(|v| v.as_string().unwrap())
            .collect()
    }
}