export const PROJECT_TITLE: string = 'SingularJS'

export const DEFAULT_COUNTRY_CODE: string = 'CN'
export const DEFAULT_LOCALE = 'zh-CN'

export const COOKIE_SECRET: string = 'cookie_secret'
export const JWT_SECRET: string = 'jwt_secret_key'

export const SMS_PROVIDER: string = 'ALIYUN'
export const ALIYUN_SMS_ACCESS_ID: string = '23493240'
export const ALIYUN_SMS_ACCESS_KEY: string = 'fcab6c93a5ce6cb54bd16892e804da8a'

export const POST_REQURIES_APPROVAL: boolean = false
export const PUBLIC_EVENT_REQURIES_APPROVAL: boolean = true

export const TOTP_CODE_LENGTH: number = 4
export const TOTP_CODE_CHARSET: string = 'numeric'

/**
 * Form input limits
 */
interface IInputLimits {
  MIN_HANDLE_LENGTH: number
  MAX_HANDLE_LENGTH: number
  MIN_PASSWORD_LENGTH: number
  MAX_PASSWORD_LENGTH: number
  MIN_NAME_LENGTH: number
  MAX_NAME_LENGTH: number
}

export const INPUT_LIMITS: IInputLimits = {
  MIN_HANDLE_LENGTH: 2,
  MAX_HANDLE_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 16,
  MIN_NAME_LENGTH: 0,
  MAX_NAME_LENGTH: 50
}
