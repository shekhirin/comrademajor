import {Kludge as WASMKludge, Message as WASMMessage} from "@pkg"
import Location from "./Location"
import Item from "./Item"

export default class Message implements Item {
  kind = "message"

  readonly id: string
  readonly author?: string
  readonly authorURL?: string
  readonly dialogName: string
  readonly highlightedParts: Array<Location>
  readonly kludges: Array<Kludge>
  readonly text: string
  readonly url?: string

  constructor(message: WASMMessage) {
    this.id = message.id
    this.author = message.author
    this.authorURL = message.authorURL
    this.dialogName = message.dialogName
    this.highlightedParts = message.highlightedParts.map((part) => new Location(part))
    this.id = message.id
    this.kludges = message.kludges.map((kludge) => new Kludge(kludge))
    this.text = message.text
    this.url = message.url
  }

  contains(term: string): boolean {
    return this.text.includes(term)
  }
}

export class Kludge {
  readonly attachmentLink: string

  constructor(kludge: WASMKludge) {
    this.attachmentLink = kludge.attachmentLink
  }
}