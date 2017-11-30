declare module "*.json" {
  const value: any;
  export default value;
}

declare module "@alicloud/sms-sdk"

// adds user agent type to express Request
declare namespace Express {
  export interface Request {
      ua?: any
  }
}