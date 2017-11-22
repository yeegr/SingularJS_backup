import { Response } from 'express'

import * as AliyunSMSClient from '@alicloud/sms-sdk'

import {
  SMS_PROVIDER,
  ALIYUN_SMS_ACCESS_ID as accessKeyId,
  ALIYUN_SMS_ACCESS_KEY as secretAccessKey
} from '../../../common/options/config'

class SMS {
  smsClient: any

  constructor(message: object) {
    switch (SMS_PROVIDER) {
      case 'ALIYUN':
        this.smsClient = new AliyunSMSClient({accessKeyId, secretAccessKey})
      break
    }

    this.send(message)
  }

  public send(message: object) {
    switch (SMS_PROVIDER) {
      case 'ALIYUN':
        this.smsClient.sendSMS({
          PhoneNumbers: '18600672503',
          SignName: '云通信产品',
          TemplateCode: 'SMS_000000',
          TemplateParam: `{
            "code":"12345",
            "product":"云通信"
          }`
        })
        .then((res: Response) => {
          console.log(res)
        })
        .catch((err: Error) => {
          console.log(err)
        })
      break
    }
  }
}

export default SMS
