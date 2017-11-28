import { Schema, model } from 'mongoose'

import IPhoto from '../interfaces/IPhoto'

let PhotoSchema: Schema = new Schema({
  url: {
    type: String,
    required: true
  },
  desc: {
    type: String
  }
}, {
  _id: false
})

export default PhotoSchema
