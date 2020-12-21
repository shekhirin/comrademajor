import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import CommentType from "./types/Comment"
import MessageType from "./types/Message"
import PostType from "./types/Post"
import {FileKind} from "@pkg"
import {Set} from "immutable"
import Item from "./types/Item"

interface Entity<T> {
  name: string
  total: number
  processedPaths: Set<string[]>
  entities: { entity: T, addedAt: number }[]
}

const initialEntity = function <T>(name: string): Entity<T> {
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
    comments: Entity<CommentType>
    messages: Entity<MessageType>
    posts: Entity<PostType>
  },
  searchTerm: string
}

const initialState: State = {
  total: 0,
  processedPaths: Set(),
  kinds: {
    comments: initialEntity("Comments"),
    messages: initialEntity("Messages"),
    posts: initialEntity("Posts")
  },
  searchTerm: ""
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
    addComment: (state, action: PayloadAction<CommentType>) => {
      state.kinds.comments.entities.push({entity: action.payload, addedAt: Date.now()})
    },
    addProcessedMessage: (state, action: PayloadAction<string[]>) => {
      state.processedPaths = state.processedPaths.add(action.payload)
      state.kinds.messages.processedPaths = state.kinds.messages.processedPaths.add(action.payload)
    },
    addMessage: (state, action: PayloadAction<MessageType>) => {
      state.kinds.messages.entities.push({entity: action.payload, addedAt: Date.now()})
    },
    addProcessedPost: (state, action: PayloadAction<string[]>) => {
      state.processedPaths = state.processedPaths.add(action.payload)
      state.kinds.posts.processedPaths = state.kinds.posts.processedPaths.add(action.payload)
    },
    addPost: (state, action: PayloadAction<PostType>) => {
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
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    }
  }
})


const selectTotal = (state: State) => state.total
const selectProcessedPaths = (state: State) => state.processedPaths
const selectEntities = (state: State) => Object.values(state.kinds)
  .map(kind => kind.entities)
  .flat()
  .sort((a, b) => b.addedAt - a.addedAt)
  .map((entity): Item => entity.entity)
const selectKinds = (state: State) => state.kinds
const selectComments = (state: State) => state.kinds.comments
const selectMessages = (state: State) => state.kinds.messages
const selectPosts = (state: State) => state.kinds.posts
const selectSearchTerm = (state: State) => state.searchTerm


export default slice.reducer
export {slice}

export {
  selectTotal,
  selectProcessedPaths,
  selectEntities,
  selectKinds,
  selectComments,
  selectMessages,
  selectPosts,
  selectSearchTerm
}

export const {
  reset,
  addProcessedComment,
  addComment,
  addProcessedMessage,
  addMessage,
  addProcessedPost,
  addPost,
  countFile,
  setSearchTerm
} = slice.actions
