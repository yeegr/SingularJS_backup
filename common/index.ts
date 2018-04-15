import * as CONFIG from './options/config'
import * as CONST from './options/constants'
import { ENV } from './options/env'
import * as ERRORS from './options/errors'
import SETTINGS from './options/settings'

import * as UTIL from './modules/util'
import { FETCH } from './modules/fetch'

let NODE_DEV = process.env.NODE_DEV || 'development',
  SERVERS = ENV[NODE_DEV]

export {
  CONFIG,
  CONST,
  ERRORS,
  UTIL,
  FETCH,
  SERVERS,
  SETTINGS
}