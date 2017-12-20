import { NativeError, Schema, model } from 'mongoose'

import { CONST, UTIL } from '../../../../common'

import IComment from '../../interfaces/actions/IComment'

let CommentSchema: Schema = new Schema({
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
  // target id
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
  },
  // parent comment
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
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
    virtuals: false
  },
  toJSON: {
    virtuals: false
  }
})

CommentSchema.virtual('CreatorModel', {
  ref: (doc: IComment) => doc.creatorRef,
  localField: 'creator',
  foreignField: '_id',
  justOne: true
})

CommentSchema.virtual('TargetModel', {
  ref: (doc: IComment) => doc.targetRef,
  localField: 'target',
  foreignField: '_id',
  justOne: true
})

CommentSchema.pre('save', function(next: Function) {
  this.wasNew = this.isNew  
  next()
})

CommentSchema.post('save', function(comment: IComment) {
  let CreatorModel = UTIL.getModelFromName(comment.creatorRef),
    TargetModel = UTIL.getModelFromName(comment.targetRef),
    wasNew = this.wasNew

  TargetModel
  .findById(comment.target)
  .then((doc: any) => {
    if (wasNew) {
      UTIL.addComment(doc, comment.rating)      

      CreatorModel
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
  let CreatorModel = UTIL.getModelFromName(comment.creatorRef),
    TargetModel = UTIL.getModelFromName(comment.targetRef)
  
  TargetModel
  .findById(comment.target)
  .then((doc: any) => {
    UTIL.removeComment(doc, comment.rating)

    CreatorModel
    .findOneAndUpdate({
      _id: comment.creator,
      commentCount: {$gt: 0}
    }, {$inc: {commentCount: -1}})
    .then()
    .catch((err: NativeError) => {
      console.log(err)
    })  
  })
  .catch((err: NativeError) => {
    console.log(err)
  })
})

export { IComment }

export default model<IComment>('Comment', CommentSchema)
