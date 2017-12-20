import * as nodemailer from 'nodemailer'
import { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer'

import * as CONFIG from '../../../common/options/config'

class Emailer {
  serverOptions: any
  mailOptions: SendMailOptions
  transporter: Transporter

  constructor(mailOptions: SendMailOptions, serverOptions: any = CONFIG.DEFAULT_EMAIL_SERVICE) {
    if (!mailOptions.hasOwnProperty('from')) {
      mailOptions.from = serverOptions.auth.user
    }

    this.transporter = nodemailer.createTransport(serverOptions)
    this.mailOptions = mailOptions
  }

  public send = () => {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(this.mailOptions, (err: Error, info: SentMessageInfo) => {
        if (err) {
          reject(err)
        }
  
        if (info.response.indexOf('250') < 0) {
          reject(err)
        }

        this.transporter.close()
        resolve()
      })
    })
  }
}

export default Emailer
