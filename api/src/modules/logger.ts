import LogModel, { ILog } from '../models/LogModel'

class Logger {
  constructor(obj: any) {
    let log: ILog = new LogModel(obj)

    log.save().then().catch((err: Error) => {
      console.log(err)
    })
  }
}

export default Logger
