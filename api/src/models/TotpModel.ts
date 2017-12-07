import { Schema, model } from 'mongoose'
import * as moment from 'moment'
import * as validator from 'validator'

import * as CONST from '../../../common/options/constants'

import ITotp from '../interfaces/ITotp'

let TotpSchema: Schema = new Schema({
  action: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true
  },
  expireAt: {
    type: Number,
    required: true,
    default: () => moment().add(5, 'minutes').valueOf()
  },
  verifiedAt: {
    type: Number,
    default: null
  },
  ip: {
    type: String,
    trim: true,
    default: '',
    match: (val: string) => validator.isIP(val)
  }
})

export default model<ITotp>('Totp', TotpSchema)
