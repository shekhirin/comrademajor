import {Comment} from "pkg/index"

interface Callbacks {
  newComment: (comment: Comment) => void
}

export default class Processor {
  callbacks: Callbacks

  constructor(callbacks: Callbacks) {
    this.callbacks = callbacks
  }

  comment(comment: Comment) {
    this.callbacks.newComment(comment)
  }
}