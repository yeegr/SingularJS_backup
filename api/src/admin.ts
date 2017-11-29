import { Router } from 'express'

import PlatformRouter from './routers/PlatformRouter'

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
    this.routes()
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
    this.router.use('/users', PlatformRouter)
  }
}

// export
const adminRouter = new AdminRouter()
adminRouter.routes()
const thisRouter = adminRouter.router

export default thisRouter
