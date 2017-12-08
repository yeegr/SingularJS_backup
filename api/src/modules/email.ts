import * as nodemailer from 'nodemailer'
import { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer'

import * as CONFIG from '../../../common/options/config'

class Emailer {
  constructor(mailOptions: SendMailOptions, serverOptions: any = CONFIG.DEFAULT_EMAIL_SERVICE) {
    let transporter: Transporter = nodemailer.createTransport(serverOptions)

    if (!mailOptions.hasOwnProperty('from')) {
      mailOptions.from = serverOptions.auth.user
    }
    
    transporter.sendMail(mailOptions, (err: Error, info: SentMessageInfo) => {
      if (err) {
        console.log(err)
        return
      }

      transporter.close()
      return info
    })
  }
}

export default Emailer
