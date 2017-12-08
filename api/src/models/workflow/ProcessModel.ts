import { NativeError, Schema, model } from 'mongoose'

import { CONST, UTIL }  from '../../../../common'

import Activity, { IActivity } from './ActivityModel'
import IProcess from '../../interfaces/workflow/IProcess'

let ProcessSchema: Schema = new Schema({
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
    required: true
  },
  // target
  target: {
    type: Schema.Types.ObjectId,
    refPath: 'targetRef',
    required: true
  },
  // target type
  targetRef: {
    type: String,
    enum: CONST.ACTION_TARGETS_ENUM,
    required: true
  },
  // process type
  type: {
    type: String,
    enum: CONST.PROCESS_TYPES_ENUM,
    required: true
  },
  // activities
  activities: [{
    type: Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  }],
  // current process status
  status: {
    type: String,
    default: CONST.STATUSES.PROCESS.PENDING,
    required: true
  },
  // process expiration time
  expireAt: {
    type: Number
  },
  // process completed time
  completedAt: {
    type: Number
  }
}, {
  toObject: {
    virtuals: false
  },
  toJSON: {
    virtuals: false
  }
})

ProcessSchema.virtual('CreatorModel', {
  ref: (doc: IProcess) => doc.creatorRef,
  localField: 'creator',
  foreignField: '_id',
  justOne: true
})

ProcessSchema.virtual('TargetModel', {
  ref: (doc: IProcess) => doc.targetRef,
  localField: 'target',
  foreignField: '_id',
  justOne: true
})

/**
 * Mark the process as 'FINALIZED'
 *
 * @class ProcessSchema
 * @method finalize
 * @returns {void}
 */
ProcessSchema.methods.finalize = function(status: string): Promise<IProcess> {
  let TargetModel = UTIL.getModelFromKey(this.targetRef)

  return TargetModel
  .findByIdAndUpdate(this.target, {status})
  .then((data: any) => {
    this.status = CONST.STATUSES.PROCESS.FINALIZED
    this.completedAt = UTIL.getTimestamp()
    return this.save()
  })
  .then((data: IProcess) => {
    return this.returnData(data)
  })
}

/**
 * Mark the process as 'FINALIZED'
 *
 * @class ProcessSchema
 * @method finalize
 * @returns {IProcess}
 */
ProcessSchema.methods.addActivity = function(act: IActivity): Promise<IProcess> {
  let activity = new Activity(act)

  return activity
  .save()
  .then((data: IActivity) => {
    this.activities.push(data._id)
    return this.save()
  })
  .then((data: IProcess) => {
    return this.returnData(data)
  })
}

ProcessSchema.pre('save', function(next: Function) {
  this.wasNew = this.isNew
  next()
})

/**
 * Return formatted process
 *
 * @class ProcessSchema
 * @method returnData
 * @returns {IProcess}
 */
ProcessSchema.methods.returnData = function(process: IProcess): Promise<IProcess> {
  return process
  .populate({
    path: 'creator', 
    select: CONST.BASIC_USER_INFO,
    options: {
      lean: true
    }
  })
  .populate('target', CONST.BASIC_CONTENT_INFO)
  .populate({
    path: 'activities',
    populate: [{
      path: 'creator',
      select: CONST.BASIC_USER_INFO,
      options: {
        lean: true
      }
    }, {
      path: 'target',
      select: CONST.BASIC_CONTENT_INFO,
      options: {
        lean: true
      }
    }, {
      path: 'handler',
      select: CONST.BASIC_USER_INFO,
      options: {
        lean: true
      }
    }]
  })
  .execPopulate()
}

export { IProcess }

export default model<IProcess>('Process', ProcessSchema)
