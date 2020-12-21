export default interface Item {
  readonly id: string
  readonly kind: string
  readonly url?: string
  contains(term: string): boolean
}