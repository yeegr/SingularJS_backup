import * as ACTIONS from '../constants/_readConstants'

export interface IItem {
  isFetching: boolean
  error: any
  data: any
}

const init: IItem = {
  isFetching: false,
  error: null,
  data: null
}

export const getReducer = (prefix: string = '') => {
  return (state: IItem = init, action: any): IItem => {
    switch (action.type) {
      case prefix + ACTIONS.GET_REQUEST:
        return {...state, 
          isFetching: true
        }

      case prefix + ACTIONS.GET_SUCCESS:
        return {...state, 
          isFetching: false,
          error: null,
          data: action.payload
        }

      case prefix + ACTIONS.GET_FAILURE:
        return {...state, 
          isFetching: false,
          error: action.error
        }

      case prefix + ACTIONS.GET_CLEAR:
        return init

      default:
        return state
    }
  }
}
