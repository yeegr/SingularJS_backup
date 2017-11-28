import { Schema, model } from 'mongoose'

import Point from './PointModel'

import IAgenda from '../interfaces/IAgenda'

let AgendaSchema: Schema = new Schema({
  day: {
    type: Number,
    default: 1
  },
  startTime: {
    type: Number,
    required: true,
    min: 0,
    max: 1439
  },
  endTime: {
    type: Number,
    min: 0,
    max: 1439
  },
  duration: {
    type: Number
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  startPoint: {
    type: Point
  },
  endPoint: {
    type: Point
  }
}, {
  _id: false
})

export default AgendaSchema
