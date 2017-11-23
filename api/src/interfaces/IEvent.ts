import {
  Document,
  Schema
} from 'mongoose'

import IAgenda from './IAgenda'
import IPhoto from './IPhoto'
import IPoint from './IPoint'
import IAttendee from './IAttendee'

export default interface IEvent extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  ref: string
  title: string
  slug: string
  description: string
  misc?: [{
    key: string
    value: string
  }]
  excerpt?: string
  hero: string
  location?: string
  destination?: string
  photos: IPhoto[]
  notes: string[]
  gears: Schema.Types.Mixed[]
  tags: [string],
  city?: string
  country?: string
  isPublic: boolean
  requireApproval: boolean
  maxAttendee: number
  minAttendee: number
  expenses: {
    deposit?: number
    perHead?: number
    insurance?: number
    detail?: string[]
    includes?: string[]
    excludes?: string[]
  }
  contacts: [{
    handle: string
    mobile?: string
    email?: string
  }]
  schedule: IAgenda[]
  subsets: [{
    title?: string
    misc?: string
    startDate: number
    deadline?: number
    rallyPoint?: IPoint
    rallyTime?: number
    status?: string
    attendees: IAttendee[]
  }]
  status: string
  updated: number
  publish: number
  totalViews: number
  totalRating: number,
  comments: [Schema.Types.ObjectId]
  totalLikes: number
  totalDislikes: number
  totalSaves: number
  totalShares: number
  totalDownloads: number

  // virtual fields
  averageRating: number

  // document status
  isNew: boolean
  wasNew: boolean

  // methods
  addToList: Function
  removeFromList: Function
  addComment: Function
  removeComment: Function
  addCount: Function
}