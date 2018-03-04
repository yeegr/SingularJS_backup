import * as PATH from './glyphs.json'

export const DEFAULT_VIEW_BOX: string = '0 0 48 48'

export interface IGlyphs {
  [key: string]: string
}

export const GLYPHS: IGlyphs = {
  "menu": (<any>PATH).hamburger,
  "close": (<any>PATH).cross,
  "next": (<any>PATH)["chevron-right"],
  "back": (<any>PATH)["chevron-left"],
  "double-arrow-left": (<any>PATH)["chevron-double-left"],
  "double-arrow-right": (<any>PATH)["chevron-double-right"],
  "dashboard": (<any>PATH).dashboard,
  "tasks": (<any>PATH)["process-loop"],
  "stats": (<any>PATH)["process-loop"],
  "system": (<any>PATH)["process-loop"],
  "account": (<any>PATH).user,
  "reviews": (<any>PATH)["pen+box"],
  "feedbacks": (<any>PATH).clipboard,
  "notifications": (<any>PATH).bell,
  "trending": (<any>PATH).fire,
  "config": (<any>PATH).wrench,
  "servers": (<any>PATH).monitoring,
  "add": (<any>PATH).plus,
  "edit": (<any>PATH).pen,
  "search": (<any>PATH).magnifier,

  "notification-on":(<any>PATH)["bell-ring"],
  "notification-off":(<any>PATH)["bell_outline"]
}
