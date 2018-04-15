import { Dispatch } from 'redux'
import * as ACTIONS from '../constants/_writeConstants'
import { CONST, FETCH, SETTINGS } from '../../common'

// create single item
const _createItemRequest = (prefix: string) => {
  return {
    type: prefix + ACTIONS.CREATE_REQUEST
  }
}

const _createItemSuccess = (prefix: string, item: any) => {
  return {
    type: prefix + ACTIONS.CREATE_SUCCESS,
    item
  }
}

const _createItemFailure = (prefix: string, error: Error) => {
  return {
    type: prefix + ACTIONS.CREATE_FAILURE,
    error
  }
}

export const createItem = (prefix: string, endpoint: string, payload: any) => {
  let config = (<any>Object).assign({}, FETCH.POST, {
    body: JSON.stringify(payload)
  })

  return (dispatch: Function) => {
    dispatch(_createItemRequest(prefix))

    return fetch(endpoint, config)
      .then((res: Response) => {
        return res.json()
      })
      .then((data: any) => {
        if (data.error) {
          dispatch(_createItemFailure(prefix, data.error))
        } else {
          dispatch(_createItemSuccess(prefix, data))
        }
      })
      .catch((err: Error) => {
        dispatch(_createItemFailure(prefix, err))
      })
  }
}

// update single item
const updateItemRequest = (prefix: string) => {
  return {
    type: prefix + ACTIONS.UPDATE_REQUEST
  }
}

const updateItemSuccess = (prefix: string, item: any) => {
  return {
    type: prefix + ACTIONS.UPDATE_SUCCESS,
    item
  }
}

const updateItemFailure = (prefix: string, error: Error) => {
  return {
    type: prefix + ACTIONS.UPDATE_FAILURE,
    error
  }
}

export const updateItem = (prefix: string, endpoint: string, id: string, payload: any) => {
  let config = (<any>Object).assign({}, FETCH.PUT, {
    body: JSON.stringify(payload)
  })

  return (dispatch: any) => {
    dispatch(updateItemRequest(prefix))

    return fetch(endpoint + '/' + id, config)
      .then((res: Response) => {
        return res.json()
      })
      .then((data: any) => {
        if (data.error) {
          dispatch(updateItemFailure(prefix, data.error))
        } else {
          dispatch(updateItemSuccess(prefix, data))
        }
      })
      .catch((err: Error) => {
        dispatch(updateItemFailure(prefix, err))
      })
  }
}

// delete single item from server
const _deleteItemRequest = (prefix: string) => {
  return {
    type: prefix + ACTIONS.DELETE_REQUEST
  }
}

const _deleteItemSuccess = (prefix: string, item: any) => {
  return {
    type: prefix + ACTIONS.DELETE_SUCCESS,
    item
  }
}

const _deleteItemFailure = (prefix: string, error: Error) => {
  return {
    type: prefix + ACTIONS.DELETE_FAILURE,
    error
  }
}

export const deleteItem = (prefix: string, endpoint: string, id: string) => {
  let config = (<any>Object).assign({}, FETCH.DELETE)

  return (dispatch: Function) => {
    dispatch(_deleteItemRequest(prefix))

    return fetch(endpoint + '/' + id, config)
      .then((res: Response) => {
        if (res.status === 410) {
          dispatch(_deleteItemSuccess(prefix, id))
        } else {
          dispatch(_deleteItemFailure(prefix, (<any>res.json()).error))
        }
      })
      .catch((err: Error) => {
        dispatch(_deleteItemFailure(prefix, err))
      })
  }
}

// remove single item from client storage
const removeItemStart = (prefix: string) => {
  return {
    type: prefix + ACTIONS.REMOVE_START
  }
}

const removeItemSuccess = (prefix: string) => {
  return {
    type: prefix + ACTIONS.REMOVE_START
  }
}

const removeItemFailure = (prefix: string) => {
  return {
    type: prefix + ACTIONS.REMOVE_START
  }
}

export const removeItem = (prefix: string, key: string, item: any) => {
  let storageEngine = SETTINGS.storageEngine,
    storageType = CONST.STORAGE_TYPE.LOCAL

  return (dispatch: Function) => {
    dispatch(removeItemStart(prefix))

    switch (storageType) {
      case CONST.STORAGE_TYPE.LOCAL:
        if (key === CONST.STORAGE_KEY.USER) {
          storageEngine.clear()
        } else {
          let arr = JSON.parse(storageEngine.getItem(key))
          arr = arr.filter((el: any) => {
            el.storageKey !== item.storageKey
          })
          storageEngine.setItem(key, JSON.stringify(arr))
        }

        dispatch(removeItemSuccess(prefix))
      break

      case CONST.STORAGE_TYPE.ASYNC:
        if (key === CONST.STORAGE_KEY.USER) {
          storageEngine
          .clear()
          .then(() => {
            dispatch(removeItemSuccess(prefix))
          })
        } else {
          storageEngine
          .getItems(key)
          .then((str: string) => {
            return JSON.parse(str)
          })
          .then((arr: any[]) => {
            return arr.filter((el: any) => {
              el.storageKey !== item.storageKey
            })
          })
          .then((arr: any[]) => {
            storageEngine
            .setItem(key, JSON.stringify(arr))
            .then(() => {
              dispatch(removeItemSuccess(prefix))
            })
          })
        }
      break
    }
  }
}

// reset single item
export const resetItem = (prefix: string) => {
  return {
    type: prefix + ACTIONS.RESET
  }
}
