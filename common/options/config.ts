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

/** 
 * .75x | ldpi    | 120dpi | 240px
 * 1x   | mdpi    | 160dpi | 320px
 * 1.5x | hdpi    | 240dpi | 480px
 * 2x   | xhdpi   | 320dpi | 720px
 * 3x   | xxhdpi  | 480dpi | 1080px
 * 4x   | xxxhdpi | 640dpi | 1440px 
*/

interface IImageSizes {
  [key: string]: number[][]
  AVATAR: number[][]
  LAUNCHER: number[][]
  SPOTLIGHT: number[][]
  SETTINGS: number[][]
  NOTIFICATION: number[][]
}

export const IMAGE_SIZES: IImageSizes = {  
  AVATAR: [
    // for Android
    [32, 32],
    [48, 48],
    [64, 64],
    [96, 96],
    [128, 128],
    // for iOS
    [40, 40],
    [80, 80],
    [120, 120]
  ],
  HERO: [
    // for Android
    [320, null],
    [480, null],
    [720, null],
    [1080, null],
    [1440, null],
    // for iOS
    [640, null],  // iPhone SE
    [750, null],  // iPhone 6/7/8
    [1125, null], // iPhone X
    [1242, null]  // iPhone 6/7/8 Plus
  ],
  LAUNCHER: [
    // for Android
    [48, 48],
    [72, 72],
    [96, 96],
    [144, 144],
    [192, 192],
    // for iOS
    [40, 40],
    [80, 80],
    [120, 120]
  ],
  SPOTLIGHT: [
    // for Android
    [32, 32],
    [48, 48],
    [64, 64],
    [96, 96],
    [128, 128],
    // for iOS
    [40, 40],
    [80, 80],
    [120, 120]
  ],
  SETTINGS: [
    // for Android
    [32, 32],
    [48, 48],
    [64, 64],
    [96, 96],
    [128, 128],
    // for iOS
    [29, 29],
    [58, 58],
    [87, 87]
  ],
  NOTIFICATION: [
    // for Android
    [24, 24],
    [36, 36],
    [48, 48],
    [72, 72],
    [96, 96],
    // for iOS
    [20, 20],
    [40, 40],
    [60, 60]
  ]
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
