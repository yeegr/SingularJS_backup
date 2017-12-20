import { Document, Schema } from 'mongoose'

export default interface IContent extends Document {
  [key: string]: any
  _id: Schema.Types.ObjectId

  // user created content
  creator: Schema.Types.ObjectId
  creatorRef: string
  slug: string
  title: string
  content: string
  excerpt?: string
  hero: string
  tags: string[]
  publish?: number
  
  // system fields
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