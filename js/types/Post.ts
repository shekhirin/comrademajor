import {Kludge as WASMKludge, Post as WASMPost} from "@pkg"
import Location from "./Location"
import Item from "./Item"

export default class Post implements Item {
  kind = "post"

  readonly id: string
  readonly author?: string
  readonly authorURL?: string
  readonly date?: string
  readonly highlightedParts?: Array<Location>
  readonly kludges: Array<Kludge>
  readonly repost?: Post
  readonly text?: string
  readonly url?: string

  constructor(post: WASMPost) {
    this.id = post.id
    this.author = post.author
    this.authorURL = post.authorURL
    this.date = post.date
    this.highlightedParts = post.highlightedParts ? post.highlightedParts.map((part) => new Location(part)) : undefined
    this.kludges = post.kludges ? post.kludges.map((kludge) => new Kludge(kludge)) : undefined
    this.repost = post.repost ? new Post(post.repost) : undefined
    this.text = post.text
    this.url = post.url
  }

  contains(term: string): boolean {
    return this.text?.includes(term) || this.repost?.text?.includes(term)
  }
}

export class Kludge {
  readonly attachmentLink: string

  constructor(kludge: WASMKludge) {
    this.attachmentLink = kludge.attachmentLink
  }
}