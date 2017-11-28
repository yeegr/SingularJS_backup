import { NativeError, Schema, model } from 'mongoose'

import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'

import IAction from '../interfaces/IAction'

let LikeSchema: Schema = new Schema({
  // creator
  creator: {
    type: Schema.Types.ObjectId,
    refPath: 'ref',
    required: true
  },
  // user type
  ref: {
    type: String,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER,
    required: true
  },
  // target model type
  type: {
    type: String,
    enum: CONST.ACTION_TARGETS_ENUM,
    required: true
  },
  // reference id
  target: {
    type: Schema.Types.ObjectId,
    refPath: 'type',
    required: true
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

LikeSchema.virtual('UserModel', {
  ref: (doc: IAction) => doc.ref,
  localField: 'creator',
  foreignField: '_id',
  justOne: true
})

LikeSchema.virtual('TargetModel', {
  ref: (doc: IAction) => doc.type,
  localField: 'target',
  foreignField: '_id',
  justOne: true
})

LikeSchema.index({ 
  creator: 1,
  ref: 1,
  type: 1,
  target: 1
}, {
  unique: true
})

LikeSchema.post('save', function(action: IAction) {
  let TargetModel = UTIL.getModelFromKey(action.type)

  TargetModel
  .findByIdAndUpdate(action.target, {$inc: {likeCount: 1}})
  .then()
  .catch((err: NativeError) => {
    console.log(err)
  })
})

LikeSchema.post('findOneAndRemove', function(action: IAction) {
  if (action) {
    let TargetModel = UTIL.getModelFromKey(action.type)
    
    TargetModel
    .findByIdAndUpdate(action.target, {$inc: {likeCount: -1}})
    .then()
    .catch((err: NativeError) => {
      console.log(err)
    })
  }
})

export default model<IAction>('Like', LikeSchema)
