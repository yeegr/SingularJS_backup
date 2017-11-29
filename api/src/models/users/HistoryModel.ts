import { Schema, model } from 'mongoose'

import IHistory from '../../interfaces/users/IHistory'

let HistorySchema: Schema = new Schema({
  created: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  target: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, {
  _id: false
})

export default HistorySchema
