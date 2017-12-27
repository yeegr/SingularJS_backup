import * as CONFIG from '../options/config'
import * as CONST from '../options/constants'

export * from '../../api/src/modules/util'

/**
 * Check if value is NOT undefined, null or an empty string
 * 
 * @export
 * @param {*} input 
 * @returns {boolean} 
 */
export function isNotUndefinedNullEmpty(input: any): boolean {
  return (input !== undefined) && (input !== null) && (typeof(input) === 'string' && input.length > 0)
}

/**
 * Returns current timestamp
 *
 * @export
 * @param {boolean} [isUnix=true]
 * @returns {number}
 */
export function getTimestamp(isUnix: boolean = true): number {
  return Math.round((new Date()).getTime() / (isUnix ? 1000 : 1))
}

/**
 * Normalizes mobile number,
 * remove all non-digital characters except dash (-)
 *
 * @param {string} mobile
 * @returns {string}
 */
export function normalizeMobile(mobile: string): string {
  return mobile.replace(/[^\d\-]/g,'')
}

/**
 * Check if number is within the specified range
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
 * @param {string} username
 * @returns {boolean}
 */
export function validateUsername(username: string): boolean {
  return validateRange(username.length, CONFIG.INPUT_LIMITS.MIN_USERNAME_LENGTH, CONFIG.INPUT_LIMITS.MAX_USERNAME_LENGTH)
}

/**
 * Check if user handle is formatted correctly
 *
 * @param {string} handle
 * @returns {boolean}
 */
export function validateHandle(handle: string): boolean {
  return validateRange(handle.length, CONFIG.INPUT_LIMITS.MIN_HANDLE_LENGTH, CONFIG.INPUT_LIMITS.MAX_HANDLE_LENGTH)
}

/**
 * Check if user password is formatted correctly
 *
 * @export
 * @param {string} password
 * @returns {boolean}
 */
export function validatePassword(password: any): boolean {
  return validateRange(password.length, CONFIG.INPUT_LIMITS.MIN_PASSWORD_LENGTH, CONFIG.INPUT_LIMITS.MAX_PASSWORD_LENGTH)
}

/**
 * Check if China personal id number is formatted correctly
 *
 * @export
 * @param {string} pid
 * @returns {boolean}
 */
export function isChinaPid(pid: string): boolean {
  let rx = new RegExp(/^(\d{17})+(\d|X)$/)
  return rx.test(pid.toUpperCase())
}

/**
 * Check if locale code is formatted correctly
 *
 * @export
 * @param {string} code
 * @returns {boolean}
 */
export function isLocaleCode(code: string): boolean {
  let rx = new RegExp(/^[a-z]{2}(_[A-Z]{2})?$/)
  return rx.test(code)
}

/**
 * Check if country code is formatted correctly
 *
 * @export
 * @param {string} code
 * @returns {boolean}
 */
export function isCountryCode(code: string): boolean {
  let rx = new RegExp(/^[A-Z]{2}$/)
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
  let arr: string[] = []

  for (let key in obj) {
    arr.push(obj[key])
  }

  return arr
}

/**
 * Converts a key-value-pair object to a tuple
 *
 * @export
 * @param {IKvp} obj
 * @returns {[string, any]}
 */
interface IKvp {
  [key: string]: any
}

export function kvp2tuple(obj: IKvp): [string, any] {
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
 * Split string into two at specified position
 * 
 * @export
 * @param {string} str 
 * @param {number} pos 
 * @returns {[string, string]} 
 */
export function splitString(str: string, pos: number): [string, string] {
  return [str.substring(0, pos), str.substring(pos)]
}

/**
 * Insert string into another at specified position
 * 
 * @export
 * @param {string} str 
 * @param {number} pos 
 * @param {string} insert 
 * @returns {string} 
 */
export function spliceString(str: string, pos: number, insert: string): string {
  let [first, last] = splitString(str, pos)
  return first + insert + last
}

/**
 * Capitalizes first letter of the string
 *
 * @export
 * @param {string} str
 * @param {boolean} [lowerCaseRest = true]
 * @returns {string}
 */
export function capitalizeFirstLetter(str: string, lowerCaseRest: boolean = true): string {
  if (lowerCaseRest) {
    str = str.toLowerCase() 
  }

  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**********************************************
 * Functions associated to payment validations
 **********************************************/

/**
 * Sorts an object's properties alphabetically by key
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
