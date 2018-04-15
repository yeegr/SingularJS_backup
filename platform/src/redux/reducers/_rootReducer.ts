import { combineReducers } from 'redux'

import home from './homeReducer'
import login from './loginReducer'
import logs from './logsReducer'
import users from './usersReducer'

export interface IStoreState {
  home: any
  login: any
  logs: any
  users: any
}

const rootReducer = combineReducers({
  home,
  login,
  logs,
  users
})

export default rootReducer
