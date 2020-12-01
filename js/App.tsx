import React, {Component} from "react"
import ReactDOM from "react-dom"
import {File as WASMFile, Kind, Message as WASMMessage} from "../pkg/index"
import Comment from "./components/Comment"
import Message from "./components/Message"
import FileType from "./types/File"
import CommentType from "./types/Comment"
import MessageType from "./types/Comment"
import {Event, EventType} from "./worker"

const worker = new Worker("worker.js")

interface Props {
}

interface State {
  comments: CommentType[]
  messages: WASMMessage[]
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const addComment = this.addComment.bind(this)
    const addMessage = this.addMessage.bind(this)

    worker.onmessage = function (e: MessageEvent<Event>) {
      switch (e.data.type) {
        case EventType.COMMENT:
          addComment(e.data.data as CommentType)
          break
        case EventType.MESSAGE:
          addMessage(e.data.data as MessageType)
          break
      }
    }

    this.state = {
      comments: [],
      messages: []
    }
  }

  addComment(comment: CommentType) {
    this.setState((prevState) => {
      return {...prevState, comments: [...prevState.comments, comment]}
    })
  }

  addMessage(message: WASMMessage) {
    this.setState((prevState) => {
      return {...prevState, messages: [...prevState.messages, message]}
    })
  }

  render() {
    return (
      <div>
        <div>
          comments:
          <ul>
            {this.state.comments.map((comment, i) =>
              <li key={i}><Comment comment={comment}/></li>
            )}
          </ul>
        </div>
        <div>
          messages:
          <ul>
            {this.state.messages.map((message, i) =>
              <li key={i}><Message message={message}/></li>
            )}
          </ul>
        </div>
        <button onClick={this.directoryPicker.bind(this)}>Choose Directory</button>
      </div>
    )
  }

  async directoryPicker() {
    const dir = await showDirectoryPicker()
    await this.printDirectoryFiles([dir.name], dir)
  }

  async printDirectoryFiles(path: string[], dir: FileSystemDirectoryHandle) {
    console.debug(`${path.join("/")}: started`)

    const t0 = performance.now()

    let filesCounter = 0

    let kind = Kind.Unknown

    if (path.length > 1) {
      switch (path[1]) {
        case "comments":
          kind = Kind.Comments
          break
        case "messages":
          kind = Kind.Messages
          break
        default:
          console.log(`${path.join("/")}: unknown kind "${path[1]}", no need to traverse`)
          return
      }
    }

    for await (const entry of dir.values()) {
      const entryPath = path.concat(entry.name)

      switch (entry.kind) {
        case "directory":
          await this.printDirectoryFiles(entryPath, await dir.getDirectoryHandle(entry.name))
          break
        case "file":
          console.debug(`${entryPath.join("/")}: started`)

          console.debug(`${entryPath.join("/")}: getting file handle & file itself...`)
          const file = await (await this.getFileHandle(dir, entry.name)).getFile()

          console.debug(`${entryPath.join("/")}: constructing UInt8Array...`)
          const data = new Uint8Array(await file.arrayBuffer())

          console.debug(`${entryPath.join("/")}: sending message to worker...`)
          worker.postMessage({
            type: EventType.FILE,
            data: new FileType(new WASMFile(
              data,
              entryPath,
              kind
            ))
          })
          filesCounter++

          console.debug(`${entryPath.join("/")}: finished`)
          break
        default:
          break
      }
    }

    const t1 = performance.now()

    console.debug(`${path.join("/")}: finished ${filesCounter} files in ${t1 - t0}ms`)
  }

  async getFileHandle(dir: FileSystemDirectoryHandle, name: string, timeout = 500, tries = 5, waitBetweenTries = 500): Promise<FileSystemFileHandle> {
    while (tries--) {
      try {
        return await new Promise(async (resolve, reject) => {
          setTimeout(() => reject("timeout"), timeout)
          resolve(await dir.getFileHandle(name))
        })
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, waitBetweenTries))
        if (!tries)
          return e
      }
    }
  }
}

ReactDOM.render(<App/>, document.getElementById("root"))
