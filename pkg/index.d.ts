/* tslint:disable */
/* eslint-disable */
/**
* @param {number} kind
* @returns {string}
*/
export function highlightKindToString(kind: number): string;
/**
*/
export enum FileKind {
  Unknown,
  Comments,
  Messages,
  Wall,
}
/**
*/
export enum HighlightKind {
  GOV,
  DRUGS,
}
/**
*/
export class Comment {
  free(): void;
/**
* @returns {Array<Location>}
*/
  readonly highlightedParts: Array<Location>;
/**
* @returns {string}
*/
  readonly id: string;
/**
* @returns {string}
*/
  readonly text: string;
/**
* @returns {string}
*/
  readonly url: string;
}
/**
*/
export class ComradeMajor {
  free(): void;
/**
*/
  constructor();
/**
* @param {File} file
* @param {any} js_processor
*/
  processFile(file: File, js_processor: any): void;
}
/**
*/
export class File {
  free(): void;
/**
* @param {Uint8Array} data
* @param {Array<string>} path
* @param {number} kind
*/
  constructor(data: Uint8Array, path: Array<string>, kind: number);
/**
* @returns {Uint8Array}
*/
  readonly data: Uint8Array;
/**
* @returns {number}
*/
  readonly kind: number;
/**
* @returns {Array<string>}
*/
  readonly path: Array<string>;
}
/**
*/
export class Kludge {
  free(): void;
/**
* @param {string} attachment_link
*/
  constructor(attachment_link: string);
/**
* @returns {string}
*/
  readonly attachmentLink: string;
}
/**
*/
export class Location {
  free(): void;
/**
* @returns {number}
*/
  end: number;
/**
* @returns {number}
*/
  kind: number;
/**
* @returns {number}
*/
  start: number;
}
/**
*/
export class Message {
  free(): void;
/**
* @returns {string | undefined}
*/
  readonly author: string | undefined;
/**
* @returns {string | undefined}
*/
  readonly authorURL: string | undefined;
/**
* @returns {string}
*/
  readonly date: string;
/**
* @returns {string}
*/
  readonly dialogName: string;
/**
* @returns {Array<Location>}
*/
  readonly highlightedParts: Array<Location>;
/**
* @returns {string}
*/
  readonly id: string;
/**
* @returns {Array<Kludge>}
*/
  readonly kludges: Array<Kludge>;
/**
* @returns {string}
*/
  readonly text: string;
/**
* @returns {string}
*/
  readonly url: string;
}
/**
*/
export class Post {
  free(): void;
/**
* @returns {string | undefined}
*/
  readonly author: string | undefined;
/**
* @returns {string | undefined}
*/
  readonly authorURL: string | undefined;
/**
* @returns {string | undefined}
*/
  readonly date: string | undefined;
/**
* @returns {Array<Location> | undefined}
*/
  readonly highlightedParts: Array<Location> | undefined;
/**
* @returns {string}
*/
  readonly id: string;
/**
* @returns {Array<Kludge> | undefined}
*/
  readonly kludges: Array<Kludge> | undefined;
/**
* @returns {Post | undefined}
*/
  readonly repost: Post | undefined;
/**
* @returns {string | undefined}
*/
  readonly text: string | undefined;
/**
* @returns {string | undefined}
*/
  readonly url: string | undefined;
}
