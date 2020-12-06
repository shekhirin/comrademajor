import {Comment, Message, Post} from "@pkg"

interface Callbacks {
  newComment: (comment: Comment) => void
  newMessage: (message: Message) => void
  newPost: (post: Post) => void
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

  post(post: Post) {
    this.callbacks.newPost(post)
  }
}