import React, {Component, ReactElement, ReactNode} from "react"
import {Message as WASMMessage} from "../../pkg/index"

interface Props {
  message: WASMMessage
}

interface State {

}

export default class Message extends Component<Props, State> {
  render() {
    return <div>
      {this.props.message.author && `${this.props.message.author}: `}{this.highlightedText()}
    </div>
  }

  highlightedText(): ReactNode {
    const {text, highlightedParts} = this.props.message
    const highlightedText: Array<string | ReactElement> = Array.from(text)

    highlightedParts
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