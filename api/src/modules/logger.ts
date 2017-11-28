import LogModel from '../models/LogModel'
import ILog from '../interfaces/ILog'

class Logger {
  constructor(obj: any) {
    let log: ILog = new LogModel(obj)

    log.save().then().catch((err: Error) => {
      console.log(err)
    })
  }
}

export default Logger
