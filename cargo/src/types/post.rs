use wasm_bindgen::prelude::*;

use crate::highlight::location::{Location, LocationArray};
use crate::js_array::binded::*;
use crate::types::{Kludge, KludgeArray};

#[wasm_bindgen]
#[derive(Clone)]
pub struct Post {
    link: Option<String>,
    author: Option<String>,
    author_url: Option<String>,
    date: Option<String>,
    text: Option<String>,
    kludges: Option<Vec<Kludge>>,
    highlighted_parts: Option<Vec<Location>>,
    repost: Option<Box<Post>>,
}

impl Post {
    pub fn new(
        link: Option<String>,
        author: Option<String>,
        author_url: Option<String>,
        date: Option<String>,
        text: Option<String>,
        kludges: Option<Vec<Kludge>>,
        highlighted_parts: Option<Vec<Location>>,
        repost: Option<Box<Post>>,
    ) -> Post {
        Post {
            link,
            author,
            author_url,
            date,
            text,
            kludges,
            highlighted_parts,
            repost,
        }
    }
}

#[wasm_bindgen]
impl Post {
    #[wasm_bindgen(getter)]
    pub fn link(&self) -> Option<String> {
        self.link.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn author(&self) -> Option<String> {
        self.author.clone()
    }

    #[wasm_bindgen(getter, js_name = "authorURL")]
    pub fn author_url(&self) -> Option<String> {
        self.author_url.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn date(&self) -> Option<String> {
        self.date.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn text(&self) -> Option<String> {
        self.text.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn kludges(&self) -> Option<KludgeArray> {
        self.kludges
            .clone()
            .map(|hp| hp.clone().to_js_array::<KludgeArray>())
    }

    #[wasm_bindgen(getter, js_name = "highlightedParts")]
    pub fn highlighted_parts(&self) -> Option<LocationArray> {
        self.highlighted_parts
            .clone()
            .map(|hp| hp.clone().to_js_array::<LocationArray>())
    }

    #[wasm_bindgen(getter)]
    pub fn repost(&self) -> Option<Post> {
        self.repost.clone().and_then(|p| Some(*p))
    }
}

impl Post {
    pub fn raw_highlighted_parts(&self) -> Option<Vec<Location>> {
        self.highlighted_parts.clone()
    }
}
