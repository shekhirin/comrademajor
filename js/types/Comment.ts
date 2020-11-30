import {Comment as WASMComment} from "../../pkg/index"
import Location from "./Location"

export default class Comment {
  readonly highlightedParts: Array<Location>
  readonly text: string
  readonly url: string | undefined

  constructor(comment: WASMComment) {
    this.highlightedParts = comment.highlightedParts.map((part) => new Location(part))
    this.text = comment.text
    this.url = comment.url
  }
}