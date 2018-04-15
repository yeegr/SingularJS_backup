import * as ACTIONS from '../constants/_readConstants'
import { ReducersMapObject } from 'redux'

export interface IList {
  isFetching: boolean
  error: any
  data: any[]
}

const init: IList = {
  isFetching: false,
  error: null,
  data: []
}

export const listReducer = (prefix: string = '') => {
  return (state: IList = init, action: any): IList => {
    switch (action.type) {
      case prefix + ACTIONS.LIST_REQUEST:
        return {...state, 
          isFetching: true
        }

      case prefix + ACTIONS.LIST_SUCCESS:
        return {...state, 
          isFetching: false,
          error: null,
          data: action.payload
        }

      case prefix + ACTIONS.LIST_FAILURE:
        return {...state, 
          isFetching: false,
          error: action.error
        }

      case prefix + ACTIONS.LIST_CLEAR:
        return init

      default:
        return state
    }
  }
}
