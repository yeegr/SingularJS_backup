import { Schema, model } from 'mongoose'

import { CONST } from '../../../../common'

import Attendee from './AttendeeModel'

import ISignup from '../../interfaces/event/ISignup'

let SignupSchema: Schema = new Schema({
  // member
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Consumer',
    required: true  
  },
  // event id
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  // subset index number
  subset: {
    type: Number,
    required: true,
    default: 0
  },
  // attendees | participants
  attendees: [Attendee],
  // total price
  total: {
    type: Number,
    required: true,
    default: 0
  },
  // order status
  status: {
    type: String,
    enum: CONST.PAYMENT_STATUSES_ENUM,
    default: CONST.STATUSES.PAYMENT.PENDING,
    required: true    
  },
  // payment methods
  paymentMethod: {
    type: String,
    enum: CONST.PAYMENT_METHODS_ENUM,
    default: CONST.PAYMENT_METHODS.ALIPAY,
    required: true
  }
})

export default model<ISignup>('Signup', SignupSchema)
