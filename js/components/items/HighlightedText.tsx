import React, {Component, ReactElement} from "react"
import Item from "../../types/items/Item"

interface Props {
  item: Item
}

export default class extends Component<Props> {
  render() {
    const {text, highlightedParts} = this.props.item
    if (!text || !highlightedParts) return null

    const highlightedText: Array<string | ReactElement> = Array.from(text)

    highlightedParts
      .slice()
      .sort((a, b) => b.start - a.start)
      .forEach(part => {
        const {start, end} = part
        const highlightedPart = <span style={{backgroundColor: 'rgba(255, 0, 0, 0.8)'}}>{text.substring(start, end)}</span>

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