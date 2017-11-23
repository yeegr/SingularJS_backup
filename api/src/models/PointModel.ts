import {
  Schema,
  model
} from 'mongoose'

import * as CONFIG from '../../../common/options/config'
import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'

import IPoint from '../interfaces/IPoint'

let PointSchema: Schema = new Schema({
  // latitude
  lat: {
    type: Number
  },
  // longitude
  lng: {
    type: Number
  },
  // altitude | elevation
  alt: {
    type: Number,
    default: 0
  },
  // name of location
  name: {
    type: String
  },
  // address
  address: {
    type: String
  },
  // city
  city: {
    type: String,
    trim: true
  },
  // 2-letter country code
  country: {
    type: String,
    default: CONFIG.DEFAULT_COUNTRY_CODE,
    minlength: 2,
    maxlength: 2,
    trim: true,
    validator: (code: string) => UTIL.validateCountry(code)
  }
}, {
  _id: false
})

export default PointSchema
