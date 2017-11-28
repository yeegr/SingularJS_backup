import { Document, Schema } from 'mongoose'

import IAgenda from './IAgenda'
import IAttendee from './IAttendee'
import IPhoto from './IPhoto'
import IPoint from './IPoint'

export default interface IEvent extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  ref: string
  slug: string
  title: string
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
  tags: string[],
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
  publish: number
  status: string
  updated: number
  totalRating: number
  commentCount: number
  viewCount: number
  likeCount: number
  dislikeCount: number
  saveCount: number
  shareCount: number
  downloadCount: number

  // virtual fields
  averageRating: number
  comments: Schema.Types.ObjectId[]
  likes: Schema.Types.ObjectId[]
  dislikes: Schema.Types.ObjectId[]
  saves: Schema.Types.ObjectId[]
  shares: Schema.Types.ObjectId[]
  downloads: Schema.Types.ObjectId[]
  follows: Schema.Types.ObjectId[]

  // document status
  isNew: boolean
  wasNew: boolean

  // methods
  addComment: Function
  removeComment: Function
}