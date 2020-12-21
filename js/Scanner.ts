import {FileKind} from "@pkg"
import {retry} from "ts-retry-promise"
import {Event, EventProcessed, EventType} from "./worker"
import update from "immutability-helper"
import CommentType from "./types/Comment"
import MessageType from "./types/Message"
import PostType from "./types/Post"

export interface ProcessedCallbacks {
  comment: (path: string[]) => void
  message: (path: string[]) => void
  post: (path: string[]) => void
}

export interface AddCallbacks {
  comment: (comment: CommentType) => void
  message: (message: MessageType) => void
  post: (post: PostType) => void
}

export default class Scanner {
  private readonly worker: Worker
  private readonly countFile: (kind: FileKind) => void

  constructor(countFile: (kind: FileKind) => void, processedCallbacks: ProcessedCallbacks, addCallbacks: AddCallbacks) {
    this.worker = new Worker("worker.js")
    this.countFile = countFile

    this.worker.onmessage = function (e: MessageEvent<Event>) {
      const {type, data} = e.data
      switch (type) {
        case EventType.PROCESSED:
          const {kind, path} = data as EventProcessed
          switch (kind) {
            case FileKind.Comments:
              processedCallbacks.comment(path)
              break
            case FileKind.Messages:
              processedCallbacks.message(path)
              break
            case FileKind.Wall:
              processedCallbacks.post(path)
              break
          }
          break
        case EventType.COMMENT:
          addCallbacks.comment(data as CommentType)
          break
        case EventType.MESSAGE:
          addCallbacks.message(data as MessageType)
          break
        case EventType.WALL:
          addCallbacks.post(data as PostType)
          break
      }
    }
  }

  async scanDirectory(path: string[], dir: FileSystemDirectoryHandle, mode: "count" | "process") {
    let kind = FileKind.Unknown

    if (path.length > 1) {
      switch (path[1]) {
        case "comments":
          kind = FileKind.Comments
          break
        case "messages":
          kind = FileKind.Messages
          break
        case "wall":
          kind = FileKind.Wall
          break
        default:
          console.debug(`${path.join("/")}: unknown kind "${path[1]}", no need to traverse`)
          return
      }
    }

    for await (const entry of dir.values()) {
      const entryPath = path.concat(entry.name)

      switch (entry.kind) {
        case "directory":
          if (kind == FileKind.Wall) {
            break
          }

          await this.scanDirectory(entryPath, await dir.getDirectoryHandle(entry.name), mode)
          break
        case "file":
          if (kind == FileKind.Unknown) {
            break
          }

          switch (mode) {
            case "count":
              this.countFile(kind)
              break
            case "process":
              console.debug(`${entryPath.join("/")}: getting file handle...`)
              const fileHandle = await retry(() => dir.getFileHandle(entry.name), {timeout: 10 * 1000, retries: 2})

              console.debug(`${entryPath.join("/")}: getting file...`)
              const file = await retry(() => fileHandle.getFile(), {timeout: 10 * 1000, retries: 2})

              console.debug(`${entryPath.join("/")}: getting file array buffer...`)
              const arrayBuffer = await file.arrayBuffer()

              console.debug(`${entryPath.join("/")}: posting worker action...`)
              this.worker.postMessage({
                type: EventType.FILE,
                data: {
                  entryPath,
                  arrayBuffer,
                  kind
                }
              }, [arrayBuffer])
              break
          }
          break
        default:
          break
      }
    }
  }
}