use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

pub trait BindedJsArray {
    fn to_js_array<U: JsCast>(self) -> U;
}

impl<T> BindedJsArray for Vec<T> where JsValue: From<T> {
    fn to_js_array<U: JsCast>(self) -> U {
        self
            .into_iter()
            .map(JsValue::from)
            .collect::<js_sys::Array>()
            .unchecked_into::<U>()
    }
}
