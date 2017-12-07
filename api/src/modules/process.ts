import Process from '../models/workflow/ProcessModel'
import IProcess from '../interfaces/workflow/IProcess'
import Activity from '../models/workflow/ActivityModel'
import IActivity from '../interfaces/workflow/IActivity'
import * as CONST from '../../../common/options/constants'
import Logger from './logger'
import Err from './err'

class ProcessClass {
  constructor(act: IActivity, type: string) {
    let process: IProcess = new Process({
        creator: act.creator,
        creatorRef: act.creatorRef,
        target: act.target,
        targetRef: act.targetRef,
        type,
        activities: [act._id]
      })

    act
    .save()
    .then((child: IActivity) => {
      process
      .save()
      .then((parent: IProcess) => {
        new Logger({
          creator: parent.creator,
          creatorRef: parent.creatorRef,
          target: parent._id,
          targetRef: CONST.ACTION_TARGETS.PROCESS,
          action: CONST.USER_ACTIONS.COMMON.CREATE
        })      
      })
    })
    .catch((err: Error) => {
      console.log(err)
    })
  }
}

export default ProcessClass
