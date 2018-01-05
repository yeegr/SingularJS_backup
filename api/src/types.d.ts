// adds type for JSON
declare module "*.json" {
  const value: any
  export default value
}

// adds type for ENV
declare module "*.env" {
  const content: string
  export default content
}

// adds user agent type to express Request
declare namespace Express {
  export interface Request {
    routeVar: {
      userType?: string
      creatorType?: string
      userHandleKey?: string
      contentType?: string
      contentCounter?: string
      keywordFields?: string
    }
    ua?: any
  }
}

declare module "@alicloud/sms-sdk"
