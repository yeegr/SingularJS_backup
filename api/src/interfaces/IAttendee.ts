import { Document, Schema } from 'mongoose'

export default interface IAttendee extends Document {
  added: number
  handle?: string
  name?: string
  gender?: number
  exp?: number
  mobile?: string
  email?: string
  pid?: string
  cost?: number
  status?: string
}