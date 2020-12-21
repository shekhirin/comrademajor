import {Comment as WASMComment} from "@pkg"
import Location from "./Location"
import Item from "./Item"

export default class Comment implements Item {
  kind = "comment"

  readonly id: string
  readonly highlightedParts: Array<Location>
  readonly text: string
  readonly url?: string

  constructor(comment: WASMComment) {
    this.id = comment.id
    this.highlightedParts = comment.highlightedParts.map((part) => new Location(part))
    this.text = comment.text
    this.url = comment.url
  }

  contains(term: string): boolean {
    return this.text.includes(term)
  }
}