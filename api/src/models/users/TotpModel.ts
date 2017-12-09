import { Schema, model } from 'mongoose'
import * as moment from 'moment-timezone'
import * as validator from 'validator'

import { CONFIG, CONST } from '../../../../common'

import ITotp from '../../interfaces/users/ITotp'

let TotpSchema: Schema = new Schema({
  action: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: CONST.TOTP_TYPES_ENUM,
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
    default: () => moment().add(CONFIG.DEFAULT_TOTP_EXPIRATION[0], CONFIG.DEFAULT_TOTP_EXPIRATION[1]).valueOf()
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

export { ITotp }

export default model<ITotp>('Totp', TotpSchema)
