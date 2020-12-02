import React, {Component} from "react"
import ReactDOM from "react-dom"
import {File as WASMFile, FileKind, Message as WASMMessage} from "../pkg/index"
import Comment from "./components/Comment"
import Message from "./components/Message"
import File from "./types/File"
import CommentType from "./types/Comment"
import MessageType from "./types/Comment"
import {Event, EventType} from "./worker"
import {retry} from "ts-retry-promise"

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
          {this.state.comments.length} comments
          {/*<ul>*/}
          {/*  {this.state.comments.map((comment, i) =>*/}
          {/*    <li key={i}><Comment comment={comment}/></li>*/}
          {/*  )}*/}
          {/*</ul>*/}
        </div>
        <div>
          {this.state.messages.length} messages
          {/*<ul>*/}
          {/*  {this.state.messages.map((message, i) =>*/}
          {/*    <li key={i}><Message message={message}/></li>*/}
          {/*  )}*/}
          {/*</ul>*/}
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

    let kind = FileKind.Unknown

    if (path.length > 1) {
      switch (path[1]) {
        case "comments":
          kind = FileKind.Comments
          break
        case "messages":
          kind = FileKind.Messages
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
          await this.printDirectoryFiles(entryPath, await dir.getDirectoryHandle(entry.name))
          break
        case "file":
          console.debug(`${entryPath.join("/")}: started`)

          console.debug(`${entryPath.join("/")}: getting file handle...`)
          const fileHandle = await retry(() => dir.getFileHandle(entry.name), {timeout: 10 * 1000, retries: 2})

          console.debug(`${entryPath.join("/")}: getting file...`)
          const file = await retry(() => fileHandle.getFile(), {timeout: 10 * 1000, retries: 2})

          console.debug(`${entryPath.join("/")}: constructing UInt8Array...`)
          const data = new Uint8Array(await file.arrayBuffer())

          console.debug(`${entryPath.join("/")}: sending message to worker...`)
          worker.postMessage({
            type: EventType.FILE,
            data: new File(new WASMFile(
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
}

ReactDOM.render(<App/>, document.getElementById("root"))
