use wasm_bindgen::JsCast;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<string>")]
    pub type StringArray;
}

impl From<Vec<String>> for StringArray {
    fn from(vec: Vec<String>) -> Self {
        vec
            .iter()
            .map(JsValue::from)
            .collect::<js_sys::Array>()
            .unchecked_into::<StringArray>()
    }
}

impl From<StringArray> for Vec<String> {
    fn from(arr: StringArray) -> Self {
        js_sys::Array::from(&JsValue::from(arr))
            .iter()
            .map(|v| v.as_string().unwrap())
            .collect()
    }
}