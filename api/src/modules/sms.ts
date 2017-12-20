import { Response } from 'express'

import * as AliyunSMSClient from '@alicloud/sms-sdk'

import {
  COMPANY_NAME,
  SMS_PROVIDER,
  ALIYUN_SMS_ACCESS_ID as accessKeyId,
  ALIYUN_SMS_ACCESS_KEY as secretAccessKey
} from '../../../common/options/config'

class SMS {
  client: any
  content: any
  send: Function

  constructor(message: any) {
    switch (SMS_PROVIDER) {
      case 'ALIYUN':
        this.client = new AliyunSMSClient({
          accessKeyId,
          secretAccessKey
        })

        this.content = {
          PhoneNumbers: message.mobile,
          SignName: COMPANY_NAME,
          TemplateCode: message.template,
          TemplateParam: `{"code": "` + message.code + `"}`
        }

        this.send = this.sendToAliyun
      break
    }    
  }

  public sendToAliyun = () => {
    return this.client.sendSMS(this.content)
  }
}

export default SMS
