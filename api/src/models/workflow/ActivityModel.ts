import { NativeError, Schema, model } from 'mongoose'

import { CONST } from '../../../../common'

import IActivity from '../../interfaces/workflow/IActivity'

let ActivitySchema: Schema = new Schema({
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
  // initial status
  initStatus: {
    type: String,
    required: true
  },
  // activity action
  action: {
    type: String,
    required: true
  },
  // incoming notes
  notes: {
    type: String
  },
  // comment content
  expireAt: {
    type: Number
  },
  // current activity state
  state: {
    type: String,
    enum: CONST.ACTIVITY_STATES_ENUM,
    default: CONST.ACTIVITY_STATES.READY,
    required: true
  },
  // activity handler
  handler: {
    type: Schema.Types.ObjectId,
    refPath: 'handlerRef'
  },
  // user type
  handlerRef: {
    type: String,
    enum: CONST.USER_TYPES_ENUM
  },
  // process time
  processedAt: {
    type: Number
  },
  // final status
  assignedStatus: {
    type: String
  },
  // outgoing / response comment
  comment: {
    type: String
  }
}, {
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: false
  }
})

ActivitySchema.virtual('CreatorModel', {
  ref: (doc: IActivity) => doc.creatorRef,
  localField: 'creator',
  foreignField: '_id',
  justOne: true
})

ActivitySchema.virtual('TargetModel', {
  ref: (doc: IActivity) => doc.targetRef,
  localField: 'target',
  foreignField: '_id',
  justOne: true
})

ActivitySchema.virtual('HandlerModel', {
  ref: (doc: IActivity) => doc.handlerRef,
  localField: 'handler',
  foreignField: '_id',
  justOne: true
})

ActivitySchema.pre('save', function(next: Function) {
  this.wasNew = this.isNew  
  next()
})

export { IActivity }

export default model<IActivity>('Activity', ActivitySchema)
