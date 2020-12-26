import React, {Component, ReactElement, ReactNode} from "react"
import MessageType from "../../types/items/Message"
import {Link} from "@material-ui/core"
import HighlightedText from "./HighlightedText"

interface Props {
  message: MessageType
}

export default class Message extends Component<Props> {
  render() {
    return <>
      <Link href={this.props.message.authorURL}>
        {this.props.message.author}
      </Link>: <HighlightedText item={this.props.message}/>
    </>
  }
}