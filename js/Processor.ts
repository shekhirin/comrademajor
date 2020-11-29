import {Comment, Message} from "pkg/index"

interface Callbacks {
  newComment: (comment: Comment) => void
  newMessage: (message: Message) => void
}

export default class Processor {
  callbacks: Callbacks

  constructor(callbacks: Callbacks) {
    this.callbacks = callbacks
  }

  comment(comment: Comment) {
    this.callbacks.newComment(comment)
  }

  message(message: Message) {
    this.callbacks.newMessage(message)
  }
}