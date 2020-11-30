import {Kludge as WASMKludge, Message as WASMMessage} from "../../pkg/index"
import Location from "./Location"

export default class Message {
  readonly author: string | undefined
  readonly authorURL: string | undefined
  readonly dialogName: string
  readonly highlightedParts: Array<Location>
  readonly id: number
  readonly kludges: Array<Kludge>
  readonly text: string

  constructor(message: WASMMessage) {
    this.author = message.author
    this.authorURL = message.authorURL
    this.dialogName = message.dialogName
    this.highlightedParts = message.highlightedParts.map((part) => new Location(part))
    this.id = message.id
    this.kludges = message.kludges.map((kludge) => new Kludge(kludge))
    this.text = message.text
  }
}

export class Kludge {
  readonly attachmentLink: string

  constructor(kludge: WASMKludge) {
    this.attachmentLink = kludge.attachmentLink
  }
}