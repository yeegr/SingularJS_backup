import {
  Schema,
  Document
} from 'mongoose'

import * as CONST from './values/constants.json'

/**
 * Check if object is NOT undefined, null, or empty string
 * 
 * @export
 * @param {object} input 
 * @returns {boolean} 
 */
export function isNotUndefinedNullEmpty(input: object): boolean {
  return (input !== undefined) && (input !== null) && (input.toString().length > 0) 
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
 * Returns the timestamp from MongoDB ObjectId
 * 
 * @param {string} id
 * @param {boolean} [isUnix=true] 
 * @return {number} 
 */
export function getTimeFromObjectId(id: string, isUnix: boolean = true): number {
  return parseInt(id.substring(0, 8), 16) * (isUnix ? 1 : 1000)
}

/**
 * Set updated timestamp
 * 
 * @export
 * @param {Document} doc 
 * @param {[string]} keys 
 */
export function setUpdateTime(doc: Document, keys: [string]): void {
  let toUpdate = false

  keys.map((key) => {
    toUpdate = (doc.isModified(key)) ? true : toUpdate
  })

  if (toUpdate) {
    (<any>doc).updated = this.getTimestamp()
  }
}

/**
 * Adds a comment to the document comment list
 * 
 * @export
 * @param {[Schema.Types.ObjectId]} arr 
 * @param {number} total 
 * @param {Schema.Types.ObjectId} id 
 * @param {number} rating 
 * @returns {[[Schema.Types.ObjectId], number]} 
 */
export function addComment(arr: [Schema.Types.ObjectId], total: number, id: Schema.Types.ObjectId, rating: number): [[Schema.Types.ObjectId], number] {
  if (arr && arr.indexOf(id) < 0) {
    arr.push(id)
    total += rating
  }

  return [arr, total]
}

/**
 * Removes a comment to the document comment list
 * 
 * @export
 * @param {[Schema.Types.ObjectId]} arr 
 * @param {number} total 
 * @param {Schema.Types.ObjectId} id 
 * @param {number} rating 
 * @returns {[[Schema.Types.ObjectId], number]} 
 */
export function removeComment(arr: [Schema.Types.ObjectId], total: number, id: Schema.Types.ObjectId, rating: number): [[Schema.Types.ObjectId], number] {
  if (arr && arr.indexOf(id) > -1) {
    arr.splice(arr.indexOf(id), 1)
    total -= rating
  }

  return [arr, total]
}

/****************************
 * General purpose functions
 ****************************/

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
 * Gets a random numeric string
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