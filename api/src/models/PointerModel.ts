import {
  Schema,
  model
} from 'mongoose'

import IPointer from '../interfaces/IPointer'

let PointerSchema: Schema = new Schema({
  ref: Schema.Types.ObjectId,
  target: String
}, {
  _id: false
})

export default PointerSchema
