import Location from "../Location"

export default interface Item {
  readonly id: string
  readonly kind: string
  readonly text?: string
  readonly highlightedParts?: Array<Location>
  readonly url?: string
  contains(term: string): boolean
  allHighlightedParts(): Array<Location>
}