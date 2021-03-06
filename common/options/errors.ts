export const SUCCESS: string = 'SUCCESS'
export const UNKNOWN: string = 'UNKNOWN_ERROR'

export const ACTION = {
  ACTION_CREATOR_REQUIRED: 'ACTION_CREATOR_REQUIRED',
  ACTION_TARGET_REQUIRED: 'ACTION_TARGET_REQUIRED',
  ACTION_TARGET_NOT_SPECIFIED: 'ACTION_TARGET_NOT_SPECIFIED',
  ACTION_TARGET_NOT_FOUND: 'ACTION_TARGET_NOT_FOUND',
  ACTION_TYPE_REQUIRED: 'ACTION_TYPE_REQUIRED',
  ACTION_TYPE_NOT_FOUND: 'ACTION_TYPE_NOT_FOUND',
  ACTION_NOT_AUTHORIZED: 'ACTION_NOT_AUTHORIZED',
  CANNOT_UNDO_NON_ACTION: 'CANNOT_UNDO_NON_ACTION',
  ACTION_NOT_FOUND: 'ACTION_NOT_FOUND',
  UNABLE_TO_PERFORM_ACTION: 'UNABLE_TO_PERFORM_ACTION',
  DUPLICATED_ACTION: 'DUPLICATED_ACTION'
}

export const LOGIN = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  UNKNOWN_QUERY: 'UNKNOWN_QUERY',
  MISSING_CREDENTIALS: 'MISSING_CREDENTIALS',  
  VALID_PASSWORD_REQUIRED: 'VALID_PASSWORD_REQUIRED',
  PASSWORDS_DO_NOT_MATCH: 'PASSWORDS_DO_NOT_MATCH',
  PASSWORD_INCORRECT: 'PASSWORD_INCORRECT',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  DUPLICATED_USER_INFORMATION: 'DUPLICATED_USER_INFORMATION',
  TOTP_ACTION_REQUIRED: 'TOTP_ACTION_REQUIRED',
  TOTP_TYPE_REQUIRED: 'TOTP_TYPE_REQUIRED',
  TOTP_TYPE_INVALID: 'TOTP_TYPE_INVALID',
  VALID_USER_NAME_REQUIRED: 'VALID_USER_NAME_REQUIRED',
  VALID_USER_HANDLE_REQUIRED: 'VALID_USER_HANDLE_REQUIRED',
  VALID_EMAIL_ADDRESS_REQUIRED: 'VALID_EMAIL_ADDRESS_REQUIRED',
  VALID_MOBILE_PHONE_NUMBER_REQUIRED: 'VALID_MOBILE_PHONE_NUMBER_REQUIRED',
  TOTP_REQUEST_SEND: 'TOTP_REQUEST_SEND',
  NO_VALID_TOTP_ISSUED: 'NO_VALID_TOTP_ISSUED',
  TOTP_CODE_EXPIRED: 'TOTP_CODE_EXPIRED',
}

export const CONTENT = {
  CONTENT_SLUG_REQUIRED: 'CONTENT_SLUG_REQUIRED',
  CONTENT_CREATOR_REQUIRED: 'CONTENT_CREATOR_REQUIRED',
  CONTENT_TITLE_REQUIRED: 'CONTENT_TITLE_REQUIRED',
  CONTENT_CONTENT_REQUIRED: 'CONTENT_CONTENT_REQUIRED',
  INSUFFICIENT_USER_PRIVILEGE: 'INSUFFICIENT_USER_PRIVILEGE',
  NO_ELIGIBLE_CONTENT_FOUND: 'NO_ELIGIBLE_CONTENT_FOUND',
  CONTENT_ALREADY_SUMMITED: 'CONTENT_ALREADY_SUMMITED',
  CONTENT_CANNOT_BE_RETRACTED: 'CONTENT_CANNOT_BE_RETRACTED'
}

export const COMMENT = {
  COMMENT_CREATOR_REQUIRED: 'COMMENT_CREATOR_REQUIRED',
  COMMENT_TARGET_REQUIRED: 'COMMENT_TARGET_REQUIRED',
  COMMENT_CONTENT_REQUIRED: 'COMMENT_CONTENT_REQUIRED'
}

export const PROGRESS = {
  ACTIVITY_IS_LOCKED: 'ACTIVITY_IS_LOCKED'
}