// adds type for JSON
declare module "*.json" {
  const value: any;
  export default value;
}

// adds user agent type to express Request
declare namespace Express {
  export interface Request {
      ua?: any
  }
}

declare module "@alicloud/sms-sdk"
