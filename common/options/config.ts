import * as CONST from './constants'

export * from './ignored'

/** 
 * export * from './ignored.ts'
 * 
export const ALIYUN_SMS_ACCESS_ID: string = ''
export const ALIYUN_SMS_ACCESS_KEY: string = ''
export const ALIYUN_SMS_TEMPLATES: any = {
  LOGIN_SIGNUP: '',
  RESET_PASSWORD: '',
  UPDATE_MOBILE_NUMBER: ''  
}
*/

export const COMPANY_NAME: string = '蓝光移客'
export const COMPANY_FULL_NAME: string = '北京蓝光移客信息技术有限公司'
export const PROJECT_TITLE: string = 'SingularJS'

export const DEFAULT_COUNTRY_CODE: string = 'CN'
export const DEFAULT_LOCALE = 'zh-CN'
export const DEFAULT_TIMEZONE: string = 'Asia/Shanghai'
export const DEFAULT_DATETIME_FORMAT: string = 'YYYY-MM-DD HH:mm:ss'

export const COOKIE_SECRET: string = 'cookie_secret'

export const SMS_PROVIDER: string = 'ALIYUN'

export const POST_REQUIRES_APPROVAL: boolean = true
export const POST_SELF_PUBLISH_ROLE: string = CONST.USER_ROLES.CONSUMER.AUTHOR
export const PUBLIC_EVENT_REQURIES_APPROVAL: boolean = true
export const PUBLIC_EVENT_PUBLISH_ROLE: string = CONST.USER_ROLES.CONSUMER.ORGANIZER

export const USER_SALT_LENGTH: number = 10
export const USER_SALT_CHARSET: string = 'alphanumeric'

export const TOTP_CODE_LENGTH: number = 4
export const TOTP_CODE_CHARSET: string = 'numeric'

export const DEFAULT_EVENT_MAX_ATTENDEE: number = 200
export const DEFAULT_EVENT_MIN_ATTENDEE: number = 20

export const DEFAULT_EMAIL_SERVICE = {
  service: '163',
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  greetingTimeout: 100000,
  auth: {
    user: 'singularjs@163.com',
    pass: 'Ss0ucSsx7622'
  }
}

export const DEFAULT_TOTP_EXPIRATION: [number, any] = [15, 'minutes']

export const RANDOMIZE_UPLOAD_FILENAME: boolean = true
export const UPLOAD_FILENAME_LENGTH: number = 10
export const UPLOAD_FILENAME_CHARSET: string = 'alphabetic'

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
  [key: string]: [number, any]
  CONSUMER: [number, any]
  SUPPLIER: [number, any]
  PLATFORM: [number, any]
}

export const USER_TOKEN_EXPIRATION: ITokenExpiration = {
  CONSUMER: [90, 'days'],
  SUPPLIER: [90, 'days'],
  PLATFORM: [90, 'days']  
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
  MAX_PASSWORD_LENGTH: 20,
  MIN_NAME_LENGTH: 0,
  MAX_NAME_LENGTH: 50,

  MIN_USERNAME_LENGTH: 6,
  MAX_USERNAME_LENGTH: 20
}
