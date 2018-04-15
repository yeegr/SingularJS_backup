import { CONST, SETTINGS, FETCH, SERVERS } from '../../common'
import * as ACTIONS from '../constants/loginConstants'

export interface ILoginActions {
  isLoggedIn: Function
  loginUser: Function
  reloadUser: Function
}

const LOGIN_STRATEGY = {
  LOCAL: 'LOCAL',
  JWT: 'JWT'
}

// check user login status
const _isLoggedIn = (token: string, user: any) => {
  return {
    type: ACTIONS.IS_LOGGED_IN,
    token,
    user
  }
}

const _isLoggedOut = () => {
  return {
    type: ACTIONS.IS_LOGGED_OUT
  }
}

export const isLoggedIn = () => {
  return (dispatch: Function) => {
    let { storageEngine } = SETTINGS

    switch (SETTINGS.storageType) {
      case CONST.STORAGE_TYPE.LOCAL:
        if (storageEngine.getItem(CONST.STORAGE_KEY.ACCESS_TOKEN).length > 0) {
          let token = storageEngine.getItem(CONST.STORAGE_KEY.ACCESS_TOKEN),
            user = JSON.parse(storageEngine.getItem(CONST.STORAGE_KEY.USER))
    
          dispatch(_isLoggedIn(token, user))
        } else {
          dispatch(_isLoggedOut())
        }
      break

      case CONST.STORAGE_TYPE.ASYNC:
        storageEngine
        .multiGet([
          CONST.STORAGE_KEY.ACCESS_TOKEN,
          CONST.STORAGE_KEY.USER
        ])
        .then((arr: [string, string][]) => {
          if (arr[0][1] && arr[1][1]) {
            let token: string = arr[0][1],
              user: any = JSON.parse(arr[1][1])

            dispatch(_isLoggedIn(token, user))
          } else {
            dispatch(_isLoggedOut())
          }
        })
      break
    }

  }
}

// store user information to local storage
const _storeUserSuccess = (user: any) => {
  return {
    type: ACTIONS.STORE_USER_SUCCESS,
    user
  }
}

const _storeUserFailure = (error: Error) => {
  return {
    type: ACTIONS.STORE_USER_FAILURE,
    error
  }
}

const _storeUser = (user: any, type: string) => {
  return (dispatch: Function) => {
    let { storageEngine } = SETTINGS

    switch (SETTINGS.storageType) {
      case CONST.STORAGE_TYPE.LOCAL:
        storageEngine.setItem(CONST.STORAGE_KEY.ACCESS_TOKEN, user.token)
        storageEngine.setItem(CONST.STORAGE_KEY.USER, JSON.stringify(user))  
        dispatch(_storeUserSuccess(user))
      break
    }
  }
}

// login
interface ICreds {
  username: string
  password: string
  device?: any
}

const _loginRequest = (creds: ICreds) => {
  return {
    type: ACTIONS.LOGIN_REQUEST,
    creds
  }
}

const _loginSuccess = (user: any) => {
  return {
    type: ACTIONS.LOGIN_SUCCESS,
    token: user.token,
    user
  }
}

const _loginFailure = (error: Error) => {
  return {
    type: ACTIONS.LOGIN_FAILURE,
    error
  }
}

export const loginUser = (creds: ICreds) => {
  // creds.device = SETTINGS.device

  let config = Object.assign({}, FETCH.POST, {
    body: JSON.stringify(creds)
  })

  return (dispatch: Function) => {
    dispatch(_loginRequest(creds))

    return fetch(SERVERS.API_SERVER + 'admin/login/local', config)
      .then((res: any) => {
        return res.json()
      })
      .then((res: any) => {
        if (res.token && res._id) {
          dispatch(_storeUser(res, LOGIN_STRATEGY.LOCAL))
        } else {
          dispatch(_loginFailure(res))
        }
      })
      .catch((err: Error) => {
        dispatch(_loginFailure(err))
      })
  }
}


const _fetchUser = (token: string) => {
  console.log('fetching user')
  // return readActions.getItem('USER', SERVERS.API_SERVER + 'admin/self')
}

export const reloadUser = () => {
  let storageEngine = localStorage

  let token = storageEngine.getItem(CONST.STORAGE_KEY.ACCESS_TOKEN)

  if (token) {
    _fetchUser(token)
  }
}