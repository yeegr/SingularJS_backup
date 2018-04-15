import { LANG, localizeError } from '../../common'
import * as ACTIONS from '../constants/loginConstants'

import IPlatform from '../../../../api/src/interfaces/users/IPlatform'

export interface ILogin {
  user?: IPlatform
  error?: {
    code: string
    message: string
  }
}

const init: ILogin = {
  user: null,
  error: null
}

const loginReducer = (state: ILogin = init, action: any): ILogin => {
  switch (action.type) {
    case ACTIONS.LOGIN_FAILURE:
      return {...state,
        user: null,
        error: localizeError(action.error.code)
      }

    case ACTIONS.STORE_USER_SUCCESS:
    case ACTIONS.IS_LOGGED_IN:
      return {...state,
        user: action.user,
        error: null
      }

    default:
      return state
  }
}

export default loginReducer
