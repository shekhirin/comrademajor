import React, {Component, ReactElement, ReactNode} from "react"
import PostType from "../../types/items/Post"
import {Link} from "@material-ui/core"
import HighlightedText from "./HighlightedText"

interface Props {
  post: PostType
}

export default class Post extends Component<Props> {
  render() {
    return <>
      <Link href={this.props.post.authorURL}>
        {this.props.post.author}
      </Link>: <HighlightedText item={this.props.post} />
      {this.props.post.repost && <Post post={this.props.post.repost} />}
    </>
  }
}