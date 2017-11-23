import {
  Document,
  Schema
} from 'mongoose'

export default interface IPost extends Document {
  _id: Schema.Types.ObjectId
  creator: Schema.Types.ObjectId
  title: string
  slug: string
  content: string
  excerpt: string
  hero: string
  tags: [string],
  status: string
  updated: number
  publish?: number
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