import {
  NativeError,
  Schema,
  model
} from 'mongoose'

import * as CONST from '../../../common/options/constants'
import * as UTIL from '../../../common/util'

import Consumer from './ConsumerModel'
import IConsumer from '../interfaces/IConsumer'
import Post from './PostModel'
import IPost from '../interfaces/IPost'

import IComment from '../interfaces/IComment'

let CommentSchema: Schema = new Schema({
  // creator
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Consumer',
    required: true
  },
  // creator user type
  type: {
    type: String,
    enum: CONST.USER_TYPES_ENUM,
    default: CONST.USER_TYPES.CONSUMER,
    required: true
  },
  // comment target
  target: {
    type: String,
    enum: CONST.ACTION_TARGETS_ENUM,
    required: true
  },
  // comment target reference slug
  ref: {
    type: String,
    required: true
  },
  // comment rating
  rating: {
    type: Number,
    required: false
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


CommentSchema.pre('save', function(next: Function) {
  this.wasNew = this.isNew

  next()
})

CommentSchema.post('save', function(doc: IComment) {
  if (doc.wasNew) {
    let UserModel = UTIL.selectDataModel(doc.type),
      TargetModel = UTIL.selectDataModel(doc.target)

    UserModel
    .findById(doc.creator)
    .then((user: any) => {
      user.addToList('comments', doc._id)
    })
    .catch((err: NativeError) => {
      console.log(err)
    })

    TargetModel
    .findById(doc.ref)
    .then((data: any) => {
      data.addComment(doc._id, doc.rating)
    })
    .catch((err: NativeError) => {
      console.log(err)
    })
  }
})

CommentSchema.post('remove', function(doc: IComment) {
  let UserModel = UTIL.selectDataModel(doc.type),
    TargetModel = UTIL.selectDataModel(doc.target)

  UserModel
  .findById(doc.creator)
  .then((user: any) => {
    user.removeFromList('comments', doc._id)
  })
  .catch((err: NativeError) => {
    console.log(err)
  })

  TargetModel
  .findById(doc.ref)
  .then((data: any) => {
    data.removeComment(doc._id, doc.rating)
  })
  .catch((err: NativeError) => {
    console.log(err)
  })
})

export default model<IComment>('Comment', CommentSchema)
