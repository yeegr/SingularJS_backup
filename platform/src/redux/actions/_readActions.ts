import * as ACTIONS from '../constants/_readConstants'

// list items
export const _listItemsRequest = (prefix: string) => {
  return {
    type: prefix + ACTIONS.LIST_REQUEST
  }
}

export const _listItemsSuccess = (prefix: string, payload: any[]) => {
  return {
    type: prefix + ACTIONS.LIST_SUCCESS,
    payload
  }
}

export const _listItemsFailure = (prefix: string, error: Error) => {
  return {
    type: prefix + ACTIONS.LIST_FAILURE,
    error
  }
}

export const listItems = (prefix: string, endpoint: string) => {
  return (dispatch: Function) => {
    dispatch(_listItemsRequest(prefix))

    return fetch(endpoint)
      .then((res: Response) => {
        return res.json()
      })
      .then((data: any) => {
        if (data.error) {
          dispatch(_listItemsFailure(prefix, data.error))
        } else {
          dispatch(_listItemsSuccess(prefix, data))
        }
      })
      .catch((err: Error) => {
        dispatch(_listItemsFailure(prefix, err))
      })
  }
}

// clear item list
export const clearList = (prefix: string) => {
  return {
    type: prefix + ACTIONS.LIST_CLEAR
  }
}

// get single item
export const _getItemRequest = (prefix: string) => {
  return {
    type: prefix + ACTIONS.GET_REQUEST
  }
}

export const _getItemSuccess = (prefix: string, payload: any) => {
  return {
    type: prefix + ACTIONS.GET_SUCCESS,
    payload
  }
}

export const _getItemFailure = (prefix: string, error: Error) => {
  return {
    type: prefix + ACTIONS.GET_FAILURE,
    error
  }
}

export const getItem = (prefix: string, endpoint: string) => {
  return (dispatch: Function) => {
    dispatch(_getItemRequest(prefix))

    return fetch(endpoint)
      .then((res: Response) => {
        return res.json()
      })
      .then((data: any) => {
        if (data.error) {
          dispatch(_getItemFailure(prefix, data.error))
        } else {
          dispatch(_getItemSuccess(prefix, data))
        }
      })
      .catch((err: Error) => {
        dispatch(_getItemFailure(prefix, err))
      })
  }
}

// clear single item
export const clearItem = (prefix: string) => {
  return {
    type: prefix + ACTIONS.GET_CLEAR
  }
}