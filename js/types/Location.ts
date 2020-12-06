import {Location as WASMLocation} from "@pkg"

export default class Location {
  readonly start: number
  readonly end: number

  constructor(location: WASMLocation) {
    this.start = location.start
    this.end = location.end
  }
}