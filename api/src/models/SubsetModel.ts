import { Schema, model } from 'mongoose'
import * as validator from 'validator'

import * as CONFIG from '../../../common/options/config'
import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'

import Attendee from './AttendeeModel'
import Point from './PointModel'

import ISubset from '../interfaces/ISubset'

let SubsetSchema: Schema = new Schema({
  // title
  title: {
    type: String
  },
  // additional information
  misc: {
    type: String
  },
  // start date
  startDate: {
    type: Number,
    required: true
  },
  // deadline for signup
  deadline: {
    type: Number
  },
  // rally location
  rallyPoint: {
    type: Point
  },
  // rally time in minutes
  rallyTime: {
    type: Number,
    min: 0,
    max: 1439
  },
  // status
  status: {
    type: String,
    enum: CONST.SET_STATUSES_ENUM,
    default: CONST.STATUSES.SET.ACCEPTING
  },
  // attendees | participants
  attendees: [Attendee]
}, {
  _id: false
})

export default SubsetSchema
