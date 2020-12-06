import {Kludge as WASMKludge, Post as WASMPost} from "@pkg"
import Location from "./Location"

export default class Post {
  readonly author: string | undefined
  readonly authorURL: string | undefined
  readonly date: string | undefined
  readonly highlightedParts: Array<Location> | undefined
  readonly kludges: Array<Kludge>
  readonly link: string | undefined
  readonly repost: Post | undefined
  readonly text: string | undefined

  constructor(post: WASMPost) {
    this.author = post.author
    this.authorURL = post.authorURL
    this.date = post.date
    this.highlightedParts = post.highlightedParts ? post.highlightedParts.map((part) => new Location(part)) : undefined
    this.kludges = post.kludges ? post.kludges.map((kludge) => new Kludge(kludge)) : undefined
    this.link = post.link
    this.repost = post.repost ? new Post(post.repost) : undefined
    this.text = post.text
  }
}

export class Kludge {
  readonly attachmentLink: string

  constructor(kludge: WASMKludge) {
    this.attachmentLink = kludge.attachmentLink
  }
}