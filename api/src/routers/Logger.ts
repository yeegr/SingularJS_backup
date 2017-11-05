import LogModel from '../models/LogModel'
import ILog from '../interfaces/ILog'

class Logger {
  constructor(obj: object) {
    let log = new LogModel(obj)
    log.save()
  }
}

export default Logger
