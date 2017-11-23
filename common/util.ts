import * as CONST from './options/constants'

export * from '../api/src/modules/util'

/**
 * Capitalizes first letter of the string
 *
 *
 * @param {string} str
 * @returns {string}
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Check if input is NOT undefined, null, or empty string
 *
 *
 * @export
 * @param {any} input
 * @returns {boolean}
 */
export function isNotUndefinedNullEmpty(input: any): boolean {
  return (input !== undefined) && (input !== null) && (input.toString().length > 0)
}

/**
 * Returns current timestamp
 *
 *
 * @export
 * @param {boolean} [isUnix=true]
 * @returns {number}
 */
export function getTimestamp(isUnix: boolean = true): number {
  return Math.round((new Date()).getTime() / (isUnix ? 1000 : 1))
}

/**
 * Check if currency is formatted correctly
 *
 *
 * @param {number} input
 * @returns {boolean}
 */
export function validateCurrency(input: number): boolean {
  let rx = new RegExp(CONST.INPUT_VALIDATORS.CURRENCY)
  return rx.test(input.toString())
}

/**
 * Check if email address is formatted correctly
 *
 *
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email: string): boolean {
  let rx = new RegExp(CONST.INPUT_VALIDATORS.EMAIL)
  return rx.test(email)
}

/**
 * Check if mobile number is formatted correctly
 *
 *
 * @param {string} mobile
 * @returns {boolean}
 */
export function validateMobile(mobile: string): boolean {
  let rx = new RegExp(RegExp(CONST.INPUT_VALIDATORS.MOBILE))
  return rx.test(mobile)
}

/**
 * Normalizes mobile number,
 * remove all non-digital characters
 *
 *
 * @param {string} mobile
 * @returns {string}
 */
export function normalizeMobile(mobile: string): string {
  return mobile.replace(/\D/g,'')
}

/**
 * Check if number is within the specified range
 *
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export function validateRange(value: number, min: number, max: number): boolean {
  let left = min - 1,
    right = max + 1

  return (value > left && value < right)
}

/**
 * Check if user handle is formatted correctly
 *
 *
 * @param {string} handle
 * @returns {boolean}
 */
export function validateHandle(handle: string): boolean {
  return validateRange(handle.length, CONST.INPUT_LIMITS.MIN_HANDLE_LENGTH, CONST.INPUT_LIMITS.MAX_HANDLE_LENGTH)
}

/**
 * Check if user password is formatted correctly
 *
 *
 * @param {string} password
 * @returns {boolean}
 */
export function validatePassword(password: string): boolean {
  return validateRange(password.length, CONST.INPUT_LIMITS.MIN_PASSWORD_LENGTH, CONST.INPUT_LIMITS.MAX_PASSWORD_LENGTH)
}

/**
 * Check if china personal id number is formatted correctly
 *
 *
 * @param {string} pid
 * @returns {boolean}
 */
export function validatePid(pid: string): boolean {
  let rx = new RegExp(CONST.INPUT_VALIDATORS.PID)
  return rx.test(pid)
}

/**
 * Check if locale code is formatted correctly
 *
 *
 * @param {string} code
 * @returns {boolean}
 */
export function validateLocale(code: string): boolean {
  let rx = new RegExp(CONST.INPUT_VALIDATORS.LOCALE)
  return rx.test(code)
}

/**
 * Check if country code is formatted correctly
 *
 *
 * @param {string} code
 * @returns {boolean}
 */
export function validateCountry(code: string): boolean {
  let rx = new RegExp(CONST.INPUT_VALIDATORS.COUNTRY)
  return rx.test(code)
}

/****************************
 * General purpose functions
 ****************************/

/**
 * Converts object properties to Mongoose enum (string array)
 *
 *
 * @param {any} obj
 * @returns {string[]}
 */
export function obj2enum(obj: any): string[] {
  let arr = []

  for (let key in obj) {
    arr.push(obj[key])
  }

  return arr
}

/**
 * Converts a key-value-pair object to a tuple
 *
 *
 * @param {any} obj
 * @returns {any[]}
 */
export function kvp2tuple(obj: any): any[] {
  let arr = [],
    tmp = {}

  for (let key in obj) {
    arr.push({
      key,
      value: obj[key]
    })
  }

  let key: string = arr[0].key,
    value: any = arr[0].value

  return [
    key,
    value
  ]
}

/**
 * Normalizes number
 *
 *
 * @export
 * @param {(number|string)} val
 * @returns {number}
 */
export function normalizeNumber(val: number|string): number {
  let output: number = (typeof val === 'string') ? parseInt(val, 10) : val
  return output
}

/**
 * Add front padding zeroes to number
 *
 *
 * @export
 * @param {number} n
 * @param {number} [digit=2]
 * @returns {string}
 */
export function zerorize(n: number, digit: number = 2): string {
  let s: string = n.toString(),
    t: string = (n < 10) ? '0' + s : s,
    p: string = '',
    d: number = digit - 2,
    i: number = 0

  if (d > 0) {
    for (i; i < d; i++) {
      p += '0'
    }

    t = p + t
  }

  return t
}

/**
 * Gets a random numeric string
 *
 *
 * @export
 * @param {number} numLength
 * @returns {string}
 */
export function getRandomNumericString(numLength: number): string {
  const max: number = 8007199254740991,
    min: number = 1000000000000000,
    digit: number = 16,
    count: number = Math.ceil(numLength / digit)

  let i: number = 0,
    str: string = ''

  for (i; i < count; i++) {
    let tmp: number = Math.round(Math.random() * max) + min
    str += tmp.toString()
  }

  return str.substring(0, numLength)
}

/**
 * Interface for setting the options of the random alphanumeric string
 *
 * @interface ICharOptions
 */
interface ICharOptions {
  type?: string
  upper?: boolean
  lower?: boolean
  numeric?: boolean
  specials?: boolean
  space?: boolean
  custom?: string
}

/**
 * Gets a random alphanumeric string
 *
 * @export
 * @param {number} [strLength=16]
 * @param {ICharOptions} [options]
 * @returns {string}
 */
export function getRandomAlphanumericString(strLength: number = 16, options?: ICharOptions): string {
  const uppers: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowers: string = 'abcdefghijklmnopqrstuvwxyz',
    numbers: string = '0123456789',
    hex: string = numbers + 'ABCDEF',
    specials: string = '!@#$%^&*()-_+,./"',
    space: string = ' '

  let charList: string = uppers + lowers + numbers

  if (options) {
    charList = ''

    if (options.hasOwnProperty('type')) {
      switch (options.type) {
        case 'alphanumeric': // default option
          charList = uppers + lowers + numbers
        break

        case 'alphabetic':
          charList = uppers + lowers
        break

        case 'numeric':
          charList = numbers
        break

        case 'hexadecimal':
          charList = hex
        break
      }
    } else {
      if (options.hasOwnProperty('upper') && options.upper) {
        charList += uppers
      }

      if (options.hasOwnProperty('lower') && options.lower) {
        charList += lowers
      }

      if (options.hasOwnProperty('numeric') && options.numeric) {
        charList += numbers
      }

      if (options.hasOwnProperty('specials') && options.specials) {
        charList += specials
      }

      if (options.hasOwnProperty('space') && options.space) {
        charList += space
      }

      if (options.hasOwnProperty('custom') && options.custom.length > 0) {
        charList = options.custom
      }
    }
  }

  let charLength: number = charList.length,
    str: string = '',
    i: number = 0

  for (i; i < strLength; i++) {
    str += charList.charAt(Math.floor(Math.random() * charLength))
  }

  return str
}

/**********************************************
 * Functions associated to payment validations
 **********************************************/

/**
 * Sorts an object's properties alphabetically by key
 *
 *
 * @export
 * @param {object} obj
 * @returns {object}
 */
export function sortObjectPropsByKey(obj: object): object {
  let arr: Array<any> = [],
    tmp: object = {},
    i: number = 0,
    j: number

  for (let key in obj) {
    arr.push({
      key,
      value: (<any>obj)[key]
    })
  }

  arr.sort((a: any, b: any) => {
    return (a.key.localeCompare(b.key))
  })


  for (i = 0, j = arr.length; i < j; i++) {
    var kvp = arr[i],
      key: string = kvp.key,
      value: any = kvp.value

    (<any>tmp)[key] = value
  }

  return tmp
}

/**
 * Converts an object into a query string
 *
 *
 * @export
 * @param {object} obj
 * @returns {string}
 */
export function obj2qs(obj: object): string {
  let str: string = ''

  for (let key in obj) {
    str += '&' + key + '=' + (<any>obj)[key].toString()
  }

  return str
}

/**
 * Converts a query string into an object
 *
 *
 * @export
 * @param {string} str
 * @returns {object}
 */
export function qs2obj(str: string): object {
  let obj: object = {},
    arr: Array<string> = str.split('&')

  arr.map((i) => {
    let kvp: string[] = i.split('='),
      key: string = kvp[0],
      value: string = kvp[1];

    (<any>obj)[key] = value
  })

  return obj
}