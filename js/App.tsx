import React, {Component} from "react"
import ReactDOM from "react-dom"
import {Comment as WASMComment, File, Kind, Message as WASMMessage, processFile} from "../pkg/index"
import Processor from "./Processor"
import Comment from "./components/Comment"
import Message from "./components/Message"

interface Props {
}

interface State {
  processor: Processor
  comments: WASMComment[]
  messages: WASMMessage[]
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      processor: new Processor({
        newComment: this.addComment.bind(this),
        newMessage: this.addMessage.bind(this)
      }),
      comments: [],
      messages: []
    }
  }

  addComment(comment: WASMComment) {
    this.setState({
      ...this.state,
      comments: [...this.state.comments, comment]
    })
  }

  addMessage(message: WASMMessage) {
    this.setState({
      ...this.state,
      messages: [...this.state.messages, message]
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
    await this.printDirectoryFiles([dir.name], dir, async file => {
      await processFile(file, this.state.processor)
    })
  }

  async printDirectoryFiles(path: string[], dir: FileSystemDirectoryHandle, fileCallback: (file: File) => void) {
    const t0 = performance.now()

    let filesCounter = 0
    let sizeCounter = 0

    let kind = Kind.Unknown

    if (path.length > 1) {
      switch (path[1]) {
        // case "comments":
        //   kind = Kind.Comments
        //   break
        case "messages":
          kind = Kind.Messages
          break
        default:
          console.log(`${path.join("/")}: unknown kind "${path[1]}", no need to traverse`)
          return
      }
    }

    for await (const entry of dir.values()) {
      switch (entry.kind) {
        case "directory":
          await this.printDirectoryFiles(path.concat(entry.name), await dir.getDirectoryHandle(entry.name), fileCallback)
          break
        case "file":
          const file = await (await dir.getFileHandle(entry.name)).getFile()

          const data = new Uint8Array(await file.arrayBuffer())
          sizeCounter += data.length

          fileCallback(new File(
            data,
            path,
            kind
          ))
          filesCounter++
          break
        default:
          break
      }
    }

    const t1 = performance.now()

    console.debug(`${path.join("/")}: ${filesCounter} files in ${t1 - t0}ms`)
  }
}

ReactDOM.render(<App/>, document.getElementById("root"))
