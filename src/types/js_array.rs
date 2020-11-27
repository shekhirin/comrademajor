use wasm_bindgen::prelude::*;
use js_sys;
use wasm_bindgen::JsCast;

// trait JsArray<T> where T: From<T> {
//     fn into_array<U: JsCast>(self) -> U;
// }
//
// impl<T> JsArray<T> for Vec<T> where T: From<T> {
//     fn into_array<U: JsCast>(self) -> U {
//         self.into_iter()
//             .map(JsValue::from)
//             .collect::<js_sys::Array>()
//             .unchecked_into::<U>()
//     }
// }
