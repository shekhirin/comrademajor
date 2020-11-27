import React, {Component, ReactElement, ReactNode} from "react"
import {Comment as WASMComment} from "../../pkg/index"

interface Props {
  comment: WASMComment
}

interface State {

}

export default class Comment extends Component<Props, State> {
  render() {
    return <div>
      {this.highlightedText()}
    </div>
  }

  highlightedText(): ReactNode {
    const {text, highlightedParts} = this.props.comment
    const highlightedText: Array<string | ReactElement> = Array.from(text)

    highlightedParts
      .sort((a, b) => b.start - a.start)
      .forEach((part, i, parts) => {
        const {start, end} = part
        const highlightedPart = <span style={{color: "red"}}>{text.substring(start, end)}</span>

        highlightedText.splice(start, end - start, highlightedPart)
      })

    return highlightedText.reduce((acc, currentValue, i) => {
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
  }
}