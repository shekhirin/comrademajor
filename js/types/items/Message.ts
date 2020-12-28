import {Kludge as WASMKludge, Message as WASMMessage} from "@pkg"
import Location from "../Location"
import Item from "./Item"

class IMessage {
  readonly id: string
  readonly author?: string
  readonly authorURL?: string
  readonly dialogName: string
  readonly highlightedParts: Array<Location>
  readonly kludges: Array<Kludge>
  readonly text: string
  readonly url?: string

  constructor(message: IMessage) {
    Object.assign(this, message)
  }
}

export default class Message extends IMessage implements Item {
  kind = "message"

  constructor(message: IMessage) {
    super(message)
  }

  static fromWASM(message: WASMMessage): Message {
    return new Message({
      id: message.id,
      author: message.author,
      authorURL: message.authorURL,
      dialogName: message.dialogName,
      highlightedParts: message.highlightedParts.map((part) => new Location(part)),
      kludges: message.kludges.map((kludge) => new Kludge(kludge)),
      text: message.text,
      url: message.url,
    })
  }

  contains(term: string): boolean {
    return this.text.includes(term)
  }

  allHighlightedParts(): Array<Location> {
    return this.highlightedParts
  }
}

export class Kludge {
  readonly attachmentLink: string

  constructor(kludge: WASMKludge) {
    this.attachmentLink = kludge.attachmentLink
  }
}