import { Schema, model } from 'mongoose'

import IMedia from '../../interfaces/share/IMedia'

let MediaSchema: Schema = new Schema({
  // relative path to resource
  path: {
    type: String,
    required: true
  },
  // relative path to resource thumbnail
  thumb: {
    type: String
  },
  // media description
  desc: {
    type: String
  }
}, {
  _id: false
})

export { IMedia }

export default MediaSchema
