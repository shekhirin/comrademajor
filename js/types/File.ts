import {File as WASMFile} from "@pkg"

export default class File {
  readonly data: Uint8Array
  readonly path: Array<string>
  readonly kind: number

  constructor(file: WASMFile) {
    this.data = file.data
    this.path = file.path
    this.kind = file.kind
  }
}