import {Comment as WASMComment} from "@pkg"
import Location from "../Location"
import Item from "./Item"

class IComment {
  readonly id: string
  readonly highlightedParts: Array<Location>
  readonly text: string
  readonly url?: string

  constructor(comment: IComment) {
    Object.assign(this, comment)
  }
}

export default class Comment extends IComment implements Item {
  kind = "comment"

  constructor(comment: IComment) {
    super(comment)
  }

  static fromWASM(comment: WASMComment): Comment {
    return new Comment({
      id: comment.id,
      highlightedParts: comment.highlightedParts.map((part) => new Location(part)),
      text: comment.text,
      url: comment.url,
    })
  }

  contains(term: string): boolean {
    return this.text.includes(term)
  }

  allHighlightedParts(): Array<Location> {
    return this.highlightedParts
  }
}