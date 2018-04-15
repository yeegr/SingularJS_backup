import { Schema, model } from 'mongoose'

import { CONFIG, CONST } from '../../../../common'

import IPoint from '../../interfaces/share/IPoint'
import * as UTIL from '../../modules/util'

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
    validator: (code: string) => UTIL.isCountryCode(code)
  }
}, {
  _id: false
})

export default PointSchema
