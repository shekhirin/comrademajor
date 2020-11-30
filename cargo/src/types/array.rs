#[macro_export]
macro_rules! js_array {
    ($array_type:ident,$array_typescript:tt) => {
        #[wasm_bindgen]
        extern "C" {
            #[wasm_bindgen(typescript_type = $array_typescript)]
            pub type $array_type;
        }
    };
}
