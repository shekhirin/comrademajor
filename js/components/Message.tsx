import React, {Component, ReactElement, ReactNode} from "react"
import MessageType from "../types/Message"
import {Link} from "@material-ui/core"

interface Props {
  message: MessageType
}

export default class Message extends Component<Props> {
  render() {
    return <>
      <Link href={this.props.message.authorURL}>{this.props.message.author}</Link>: {this.highlightedText()}
    </>
  }

  highlightedText(): ReactNode {
    const {text, highlightedParts} = this.props.message
    const highlightedText: Array<string | ReactElement> = Array.from(text)

    highlightedParts
      .slice()
      .sort((a, b) => b.start - a.start)
      .forEach((part, i, parts) => {
        const {start, end} = part
        const highlightedPart = <span style={{color: "red"}}>{text.substring(start, end)}</span>

        highlightedText.splice(start, end - start, highlightedPart)
      })

    return highlightedText
      .reduce((acc, currentValue, i) => {
        if (i == 0) {
          return [currentValue]
        } else {
          if (typeof currentValue == "string" && typeof acc[acc.length - 1] == "string") {
            return [...acc.slice(0, acc.length - 1), acc[acc.length - 1] + currentValue]
          } else {
            return [...acc, currentValue]
          }
        }
      }, [] as Array<string | ReactElement>)
      .map((el, i) => {
        if (typeof el == "string") {
          return <span key={`text-${i}`}>{el}</span>
        } else {
          return React.cloneElement(el, {key: `highlight-${i}`})
        }
      })
  }
}