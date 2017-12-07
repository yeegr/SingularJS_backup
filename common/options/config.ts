export const PROJECT_TITLE: string = 'SingularJS'

export const DEFAULT_COUNTRY_CODE: string = 'CN'
export const DEFAULT_LOCALE = 'zh-CN'

export const COOKIE_SECRET: string = 'cookie_secret'

export const SMS_PROVIDER: string = 'ALIYUN'
export const ALIYUN_SMS_ACCESS_ID: string = '23493240'
export const ALIYUN_SMS_ACCESS_KEY: string = 'fcab6c93a5ce6cb54bd16892e804da8a'

export const POST_REQURIES_APPROVAL: boolean = true
export const PUBLIC_EVENT_REQURIES_APPROVAL: boolean = true

export const TOTP_CODE_LENGTH: number = 4
export const TOTP_CODE_CHARSET: string = 'numeric'


/**
 * JWT secrets to sign users
 */
interface IJwtSecrets {
  [key: string]: string
  CONSUMER: string
  SUPPLIER: string
  PLATFORM: string
}

export const JWT_SECRETS: IJwtSecrets = {
  CONSUMER: 'consumer_jwt_secret',
  SUPPLIER: 'supplier_jwt_secret',
  PLATFORM: 'platform_jwt_secret'
}

/**
 * User token expirations
 */
interface ITokenExpiration {
  [key: string]: [any, number]
  CONSUMER: [any, number]
  SUPPLIER: [any, number]
  PLATFORM: [any, number]
}

export const USER_TOKEN_EXPIRATION: ITokenExpiration = {
  CONSUMER: ['days', 90],
  SUPPLIER: ['days', 90],
  PLATFORM: ['days', 90]  
}

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

  MIN_USERNAME_LENGTH: number
  MAX_USERNAME_LENGTH: number
}

export const INPUT_LIMITS: IInputLimits = {
  MIN_HANDLE_LENGTH: 2,
  MAX_HANDLE_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 16,
  MIN_NAME_LENGTH: 0,
  MAX_NAME_LENGTH: 50,

  MIN_USERNAME_LENGTH: 6,
  MAX_USERNAME_LENGTH: 20
}
