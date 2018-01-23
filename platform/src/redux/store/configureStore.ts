import { createStore, applyMiddleware } from 'redux'

import promiseMiddleware from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import rootReducer from '../reducers/_rootReducer'

const promise = promiseMiddleware(), 
  logger = createLogger()

export default function configureStore() {
  return createStore(
    rootReducer,
    applyMiddleware(
      thunk,
      promise,
      logger
    )
  )
}