import * as CONFIG from './options/config'
import * as CONST from './options/constants'
import * as ERRORS from './options/errors'
import { ENV } from './options/env'

import * as UTIL from './modules/util'
import { FETCH } from './modules/fetch'

let NODE_DEV = process.env.NODE_DEV || 'development',
  SERVERS = ENV[NODE_DEV]

interface ISettings {
  storageEngine?: any
}

let SETTINGS: ISettings = {}

export {
  CONFIG,
  CONST,
  ERRORS,
  UTIL,
  FETCH,
  SERVERS,
  SETTINGS
}