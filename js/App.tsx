import React, {Component} from "react"
import ReactDOM from "react-dom"
import {File as WASMFile, FileKind} from "../pkg/index"
import File from "./types/File"
import CommentType from "./types/Comment"
import MessageType from "./types/Comment"
import PostType from "./types/Post"
import {Event, EventProcessed, EventType} from "./worker"
import {retry} from "ts-retry-promise"

const worker = new Worker("worker.js")

interface Props {
}

interface State {
  totalComments: number
  processedComments: Set<string[]>
  comments: CommentType[]

  totalMessages: number
  processedMessages: Set<string[]>
  messages: MessageType[]

  totalPosts: number
  processedPosts: Set<string[]>
  posts: PostType[]
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const addComment = this.addComment.bind(this)
    const addMessage = this.addMessage.bind(this)
    const addPost = this.addPost.bind(this)

    const setState = this.setState.bind(this)

    worker.onmessage = function (e: MessageEvent<Event>) {
      const {type, data} = e.data
      switch (type) {
        case EventType.PROCESSED:
          const {kind, path} = data as EventProcessed
          switch (kind) {
            case FileKind.Comments:
              setState((prevState) => {
                return {...prevState, processedComments: prevState.processedComments.add(path)}
              })
              break
            case FileKind.Messages:
              setState((prevState) => {
                return {...prevState, processedMessages: prevState.processedMessages.add(path)}
              })
              break
            case FileKind.Wall:
              setState((prevState) => {
                return {...prevState, processedPosts: prevState.processedPosts.add(path)}
              })
              break
          }
          break
        case EventType.COMMENT:
          addComment(data as CommentType)
          break
        case EventType.MESSAGE:
          addMessage(data as MessageType)
          break
        case EventType.WALL:
          addPost(data as PostType)
          break
      }
    }

    this.state = {
      totalComments: 0,
      processedComments: new Set(),
      comments: [],
      totalMessages: 0,
      processedMessages: new Set(),
      messages: [],
      totalPosts: 0,
      processedPosts: new Set(),
      posts: []
    }
  }

  addComment(comment: CommentType) {
    this.setState((prevState) => {
      return {...prevState, comments: [...prevState.comments, comment]}
    })
  }

  addMessage(message: MessageType) {
    this.setState((prevState) => {
      return {...prevState, messages: [...prevState.messages, message]}
    })
  }

  addPost(post: PostType) {
    this.setState((prevState) => {
      return {...prevState, posts: [...prevState.posts, post]}
    })
  }

  render() {
    return (
      <div>
        <div>
          {this.state.comments.length} comments ({this.state.processedComments.size}/{this.state.totalComments} files)
          {/*<ul>*/}
          {/*  {this.state.comments.map((comment, i) =>*/}
          {/*    <li key={i}><Comment comment={comment}/></li>*/}
          {/*  )}*/}
          {/*</ul>*/}
        </div>
        <div>
          {this.state.messages.length} messages ({this.state.processedMessages.size}/{this.state.totalMessages} files)
          {/*<ul>*/}
          {/*  {this.state.messages.map((message, i) =>*/}
          {/*    <li key={i}><Message message={message}/></li>*/}
          {/*  )}*/}
          {/*</ul>*/}
        </div>
        <div>
          {this.state.posts.length} posts ({this.state.processedPosts.size}/{this.state.totalPosts} files)
          {/*<ul>*/}
          {/*  {this.state.posts.map((post, i) =>*/}
          {/*    <li key={i}><Post post={post}/></li>*/}
          {/*  )}*/}
          {/*</ul>*/}
        </div>
        <button onClick={this.directoryPicker.bind(this)}>Choose Directory</button>
      </div>
    )
  }

  async directoryPicker() {
    const dir = await showDirectoryPicker()
    console.debug("collecting promise actions...")
    const promiseActions = await this.printDirectoryFiles([dir.name], dir)
    console.debug(`awaiting ${promiseActions.length} promise actions...`)
    while (promiseActions.length) {
      await Promise.all(promiseActions.splice(0, 10).map(async action =>
        new Promise(async (resolve, reject) => resolve(await action()))
      ))
    }
    console.debug("done!")
  }

  async printDirectoryFiles(path: string[], dir: FileSystemDirectoryHandle): Promise<(() => void)[]> {
    let kind = FileKind.Unknown

    const promiseActions: (() => void)[] = []

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
          return promiseActions
      }
    }

    for await (const entry of dir.values()) {
      const entryPath = path.concat(entry.name)

      switch (entry.kind) {
        case "directory":
          if (kind == FileKind.Wall) {
            break
          }

          promiseActions.push(...await this.printDirectoryFiles(entryPath, await dir.getDirectoryHandle(entry.name)))
          break
        case "file":
          if (kind == FileKind.Unknown) {
            break
          }

          switch (kind) {
            case FileKind.Comments:
              this.setState((prevState) => {
                return {...prevState, totalComments: prevState.totalComments + 1}
              })
              break
            case FileKind.Messages:
              this.setState((prevState) => {
                return {...prevState, totalMessages: prevState.totalMessages + 1}
              })
              break
            case FileKind.Wall:
              this.setState((prevState) => {
                return {...prevState, totalPosts: prevState.totalPosts + 1}
              })
              break
          }

          promiseActions.push(async () => {
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

            console.debug(`${entryPath.join("/")}: finished`)
          })
          break
        default:
          break
      }
    }

    return promiseActions
  }
}

ReactDOM.render(<App/>, document.getElementById("root"))
