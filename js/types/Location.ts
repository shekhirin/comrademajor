import {Location as WASMLocation, HighlightKind as WASMHighlightKind} from "@pkg"

export default class Location {
  readonly start: number
  readonly end: number
  readonly kind: WASMHighlightKind

  constructor(location: WASMLocation) {
    this.start = location.start
    this.end = location.end
    this.kind = location.kind
  }
}