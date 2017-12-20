import { NativeError, Schema, model } from 'mongoose'

import { CONST, UTIL } from '../../../../common'

import IAction from '../../interfaces/actions/IAction'

let LikeSchema: Schema = new Schema({
  // creator
  creator: {
    type: Schema.Types.ObjectId,
    refPath: 'creatorRef',
    required: true
  },
  // user type
  creatorRef: {
    type: String,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER,
    required: true
  },
  // reference id
  target: {
    type: Schema.Types.ObjectId,
    refPath: 'targetRef',
    required: true
  },
  // target reference
  targetRef: {
    type: String,
    enum: CONST.ACTION_TARGETS_ENUM,
    required: true
  }
}, {
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: false
  }
})

LikeSchema.index({ 
  creator: 1,
  creatorRef: 1,
  target: 1,
  targetRef: 1
}, {
  unique: true
})

LikeSchema.virtual('CreatorModel', {
  ref: (doc: IAction) => doc.creatorRef,
  localField: 'creator',
  foreignField: '_id',
  justOne: true
})

LikeSchema.virtual('TargetModel', {
  ref: (doc: IAction) => doc.targetRef,
  localField: 'target',
  foreignField: '_id',
  justOne: true
})

LikeSchema.post('save', function(action: IAction) {
  let TargetModel = UTIL.getModelFromName(action.targetRef)

  TargetModel
  .findByIdAndUpdate(action.target, {$inc: {likeCount: 1}})
  .then()
  .catch((err: NativeError) => {
    console.log(err)
  })
})

LikeSchema.post('findOneAndRemove', function(action: IAction) {
  if (action) {
    let TargetModel = UTIL.getModelFromName(action.targetRef)
    
    TargetModel
    .findByIdAndUpdate(action.target, {$inc: {likeCount: -1}})
    .then()
    .catch((err: NativeError) => {
      console.log(err)
    })
  }
})

export default model<IAction>('Like', LikeSchema)
