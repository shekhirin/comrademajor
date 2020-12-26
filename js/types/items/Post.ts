import {Kludge as WASMKludge, Post as WASMPost} from "@pkg"
import Location from "../Location"
import Item from "./Item"

class IPost {
  readonly id: string
  readonly author?: string
  readonly authorURL?: string
  readonly date?: string
  readonly highlightedParts?: Array<Location>
  readonly kludges: Array<Kludge>
  readonly repost?: Post
  readonly text?: string
  readonly url?: string

  constructor(post: IPost) {
    Object.assign(this, post)
  }
}

export default class Post extends IPost implements Item {
  kind = "post"

  constructor(post: IPost) {
    super(post)
  }

  static fromWASM(post: WASMPost): Post{
    return new Post({
      id: post.id,
      author: post.author,
      authorURL: post.authorURL,
      date: post.date,
      highlightedParts: post.highlightedParts ? post.highlightedParts.map((part) => new Location(part)) : undefined,
      kludges: post.kludges ? post.kludges.map((kludge) => new Kludge(kludge)) : undefined,
      repost: post.repost ? Post.fromWASM(post.repost) : undefined,
      text: post.text,
      url: post.url,
    })
  }

  contains(term: string): boolean {
    return this?.text?.includes(term) || this?.repost?.contains(term)
  }
}

export class Kludge {
  readonly attachmentLink: string

  constructor(kludge: WASMKludge) {
    this.attachmentLink = kludge.attachmentLink
  }
}