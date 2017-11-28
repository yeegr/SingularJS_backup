import { Request } from 'express'

export default interface IRequest extends Request {
  referrer: {
    type: string
    slug: string
  }
}