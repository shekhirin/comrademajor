use wasm_bindgen::JsCast;
use wasm_bindgen::prelude::*;

// impl<U, T> From<Vec<T>> for U where U: JsCast, JsValue: From<T> {
//     fn from(vec: Vec<T>) -> Self {
//         vec
//             .into_iter()
//             .map(JsValue::from)
//             .collect::<js_sys::Array>()
//             .unchecked_into::<U>()
//     }
// }

pub trait BindedJsArray {
    fn to_js_array<U: JsCast>(self) -> U;
}

impl<T> BindedJsArray for Vec<T>
    where
        JsValue: From<T>,
{
    fn to_js_array<U: JsCast>(self) -> U {
        self.into_iter()
            .map(JsValue::from)
            .collect::<js_sys::Array>()
            .unchecked_into::<U>()
    }
}