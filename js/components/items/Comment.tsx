import React, {Component, ReactElement, ReactNode} from "react"
import CommentType from "../../types/items/Comment"
import HighlightedText from "./HighlightedText"

interface Props {
  comment: CommentType
}

export default class Comment extends Component<Props> {
  render() {
    return <HighlightedText item={this.props.comment} />
  }
}