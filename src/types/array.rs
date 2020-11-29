use wasm_bindgen::prelude::*;

#[wasm_bindgen(typescript_custom_section)]
const TS_WRAPPER: &'static str = r#"
export class Wrapper {
  obj: any

  constructor(obj: any) {
    this.obj = obj
  }

  get_inner(): any {
    return this.obj
  }
}
"#;

#[macro_export]
macro_rules! array {
    ($type:ty,$array_type:ident,$array_typescript:tt,$wrapper:ident) => {
        #[wasm_bindgen]
        extern "C" {
            #[wasm_bindgen(typescript_type = $array_typescript)]
            pub type $array_type;

            #[wasm_bindgen(js_class = "Wrapper")]
            pub type $wrapper;

            #[wasm_bindgen(method)]
            pub fn get_inner(this: &$wrapper) -> $type;
        }

        impl $array_type {
            pub fn to_vec(&self) -> Vec<$type> {
                js_sys::Array::from(&JsValue::from(self))
                    .iter()
                    .map(|v| v.unchecked_into::<$wrapper>().get_inner())
                    .collect()
            }
        }
    };
}