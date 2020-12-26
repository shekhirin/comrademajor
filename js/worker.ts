import Comment from "./types/items/Comment"
import Message from "./types/items/Message"
import Post from "./types/items/Post"
import Processor from "./Processor"
import {FileKind} from "@pkg"

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

export interface EventFile {
  entryPath: string[]
  arrayBuffer: ArrayBuffer
  kind: FileKind
}

const processor = new Processor(
  {
    newComment: function (obj) {
      self.postMessage({type: EventType.COMMENT, data: Comment.fromWASM(obj)})
    },
    newMessage: function (obj) {
      self.postMessage({type: EventType.MESSAGE, data: Message.fromWASM(obj)})
    },
    newPost: function (obj) {
      self.postMessage({type: EventType.WALL, data: Post.fromWASM(obj)})
    }
  }
)

import("@pkg")
  .then(wasm => {
    const comradeMajor = new wasm.ComradeMajor()

    self.onmessage = async (e: MessageEvent<Event>) => {
      if (e.data.type === EventType.FILE) {
        const {entryPath, arrayBuffer, kind} = e.data.data as EventFile

        console.debug(`${entryPath.join("/")}: constructing UInt8Array...`)
        const data = new Uint8Array(arrayBuffer)

        console.debug(`${entryPath.join("/")}: processing file with WASM...`)
        comradeMajor.processFile(new wasm.File(data, entryPath, kind), processor)

        console.debug(`${entryPath.join("/")}: sending processed event back to main thread...`)
        self.postMessage({type: EventType.PROCESSED, data: {kind, path: entryPath}})
      }
    }
  })
  .catch(err => console.error("Error importing wasm module", err))
