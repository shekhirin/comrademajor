import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import Comment from "./types/items/Comment"
import Message from "./types/items/Message"
import Post from "./types/items/Post"
import {FileKind} from "@pkg"
import {Set} from "immutable"
import Item from "./types/items/Item"

interface Entity<T> {
  entity: T,
  addedAt: number
}

interface Kind<T> {
  name: string
  total: number
  processedPaths: Set<string[]>
  entities: Entity<T>[]
}

const initialKind = function <T>(name: string): Kind<T> {
  return {
    name,
    total: 0,
    processedPaths: Set(),
    entities: []
  }
}

interface State {
  total: number
  processedPaths: Set<string[]>
  kinds: {
    comments: Kind<Comment>
    messages: Kind<Message>
    posts: Kind<Post>
  }
}

const initialState: State = {
  total: 0,
  processedPaths: Set(),
  kinds: {
    comments: initialKind("Comments"),
    messages: initialKind("Messages"),
    posts: initialKind("Posts")
  }
}


const slice = createSlice({
  name: "main",
  initialState,
  reducers: {
    reset: () => initialState,
    addProcessedComment: (state, action: PayloadAction<string[]>) => {
      state.processedPaths = state.processedPaths.add(action.payload)
      state.kinds.comments.processedPaths = state.kinds.comments.processedPaths.add(action.payload)
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      state.kinds.comments.entities.push({entity: action.payload, addedAt: Date.now()})
    },
    addProcessedMessage: (state, action: PayloadAction<string[]>) => {
      state.processedPaths = state.processedPaths.add(action.payload)
      state.kinds.messages.processedPaths = state.kinds.messages.processedPaths.add(action.payload)
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.kinds.messages.entities.push({entity: action.payload, addedAt: Date.now()})
    },
    addProcessedPost: (state, action: PayloadAction<string[]>) => {
      state.processedPaths = state.processedPaths.add(action.payload)
      state.kinds.posts.processedPaths = state.kinds.posts.processedPaths.add(action.payload)
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.kinds.posts.entities.push({entity: action.payload, addedAt: Date.now()})
    },
    countFile: (state, action: PayloadAction<FileKind>) => {
      state.total += 1

      switch (action.payload) {
        case FileKind.Comments:
          state.kinds.comments.total += 1
          break
        case FileKind.Messages:
          state.kinds.messages.total += 1
          break
        case FileKind.Wall:
          state.kinds.posts.total += 1
          break
      }
    }
  }
})


const selectTotal = (state: State) => state.total
const selectProcessedPaths = (state: State) => state.processedPaths
const selectEntities = (state: State) => Object
  .values({
    comments: state.kinds.comments.entities.map(obj => {return {...obj, entity: new Comment(obj.entity)}}),
    messages: state.kinds.messages.entities.map(obj => {return {...obj, entity: new Message(obj.entity)}}),
    posts: state.kinds.posts.entities.map(obj => {return {...obj, entity: new Post(obj.entity)}})
  })
  .flat()
  .sort((a, b) => b.addedAt - a.addedAt)
  .map((entity): Item => entity.entity)
const selectKinds = (state: State) => state.kinds


export default slice.reducer
export {slice}

export {
  selectTotal,
  selectProcessedPaths,
  selectEntities,
  selectKinds
}

export const {
  reset,
  addProcessedComment,
  addComment,
  addProcessedMessage,
  addMessage,
  addProcessedPost,
  addPost,
  countFile
} = slice.actions
