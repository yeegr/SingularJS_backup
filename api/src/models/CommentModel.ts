import { NativeError, Schema, model } from 'mongoose'

import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'

import IComment from '../interfaces/IComment'

let CommentSchema: Schema = new Schema({
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
  // target id
  target: {
    type: Schema.Types.ObjectId,
    refPath: 'type',
    required: true
  },
  // comment rating
  rating: {
    type: Number,
    required: false
  },
  // store diff between original and updated ratings
  diff: {
    type: Number,
    default: 0
  },
  // comment content
  content: {
    type: String,
    default: ''
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

CommentSchema.virtual('UserModel', {
  ref: (doc: IComment) => doc.ref,
  localField: 'creator',
  foreignField: '_id',
  justOne: true
})

CommentSchema.virtual('TargetModel', {
  ref: (doc: IComment) => doc.type,
  localField: 'target',
  foreignField: '_id',
  justOne: true
})

CommentSchema.pre('save', function(next: Function) {
  this.wasNew = this.isNew  
  next()
})

CommentSchema.post('save', function(comment: IComment) {
  let UserModel = UTIL.getModelFromKey(comment.ref),
    TargetModel = UTIL.getModelFromKey(comment.type),
    wasNew = this.wasNew

  TargetModel
  .findById(comment.target)
  .then((doc: any) => {
    if (wasNew) {
      UTIL.addComment(doc, comment.rating)      

      UserModel
      .findByIdAndUpdate(comment.creator, {$inc: {commentCount: 1}})
      .then()
      .catch((err: NativeError) => {
        console.log(err)
      })
    } else {
      UTIL.updateComment(doc, comment.diff)
    }
  })
  .catch((err: NativeError) => {
    console.log(err)
  })
})

CommentSchema.post('findOneAndRemove', function(comment: IComment) {
  let UserModel = UTIL.getModelFromKey(comment.ref),
    TargetModel = UTIL.getModelFromKey(comment.type)
  
  TargetModel
  .findById(comment.target)
  .then((doc: any) => {
    UTIL.removeComment(doc, comment.rating)

    UserModel
    .findByIdAndUpdate(comment.creator, {$inc: {commentCount: -1}})
    .then()
    .catch((err: NativeError) => {
      console.log(err)
    })  
  })
  .catch((err: NativeError) => {
    console.log(err)
  })
})

export default model<IComment>('Comment', CommentSchema)
