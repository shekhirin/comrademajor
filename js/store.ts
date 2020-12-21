import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit"
import reducer from "./slice"

const middleware = getDefaultMiddleware({
  serializableCheck: false,
  immutableCheck: false
})

export const store = configureStore({
  reducer: reducer,
  middleware: middleware
})