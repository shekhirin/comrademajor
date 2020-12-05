import File from "./types/File"
import Comment from "./types/Comment"
import Message from "./types/Message"
import Post from "./types/Post"
import Processor from "./Processor"

export enum EventType {
  PROCESSED,
  FILE,
  COMMENT,
  MESSAGE,
  WALL
}

export interface Event {
  type: EventType,
  data: any
}

export interface EventProcessed {
  kind: number,
  path: string[]
}

const processor = new Processor(
  {
    newComment: function (obj) {
      self.postMessage({type: EventType.COMMENT, data: new Comment(obj)})
    },
    newMessage: function (obj) {
      self.postMessage({type: EventType.MESSAGE, data: new Message(obj)})
    },
    newPost: function (obj) {
      self.postMessage({type: EventType.WALL, data: new Post(obj)})
    }
  }
)

import("../pkg/index")
  .then(wasm => {
    self.onmessage = function (e: MessageEvent<Event>) {
      if (e.data.type === EventType.FILE) {
        const file = e.data.data as File
        console.debug(`${file.path.join("/")}: received message in worker`)

        wasm.processFile(new wasm.File(file.data, file.path, file.kind), processor)

        self.postMessage({type: EventType.PROCESSED, data: {kind: file.kind, path: file.path}})
      }
    }
  })
  .catch(err => console.error("Error importing wasm module", err))
