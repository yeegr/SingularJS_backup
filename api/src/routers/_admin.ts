import { Router } from 'express'

import PlatformRouter from './PlatformRouter'
import ProcessRouter from './ProcessRouter'
import ActivityRouter from './ActivityRouter'

/**
 * AdminRouter class
 *
 * @class AdminRouter
 */
class AdminRouter {
  public router: Router

  /**
   * Constructor
   *
   * @class AdminRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
  }

  /**
   * Configures routes
   *
   * @class AdminRouter
   * @method routes
   * @return {void}
   */
  public routes(): void {
    // user router
    this.router.use('/', PlatformRouter)

    // process router
    this.router.use('/processes', ProcessRouter)

    // process router
    this.router.use('/activities', ActivityRouter)
  }
}

// export
const adminRouter = new AdminRouter()
adminRouter.routes()
const thisRouter = adminRouter.router

export default thisRouter
