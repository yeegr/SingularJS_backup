import { Request, Response, NextFunction } from 'express'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as cookieParser from "cookie-parser"
import * as cors from 'cors'
import * as express from 'express'
import * as helmet from 'helmet'
import * as logger from 'morgan'
import * as path from 'path'

import * as CONFIG from '../../common/options/config'
import FileRouter from './file'

/**
 * Server class
 *
 * @class Server
 */
class Server {
  public app: express.Application

  /**
   * Class constructor
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.app = express()

    // configure application
    this.config()

    // configure routes
    this.routes()
  }

  /**
   * Configures application
   *
   * @class Server
   * @method config
   * @return {void}
   */
  public config(): void {
    // mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }))

    // mount json form parser
    this.app.use(bodyParser.json())

    // mount cookie parker
    this.app.use(cookieParser())

    // mount logger
    this.app.use(logger("dev"))
    
    // mount compression
    this.app.use(compression())
    
    // mount helmet
    this.app.use(helmet())
    
    // mount cors
    this.app.use(cors())

    // cors
    // this.app.use((req: Request, res: Response, next: NextFunction) => {
    //   res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, PURGE')
    //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials')
    //   res.header('Access-Control-Allow-Credentials', 'true')
    //   next()
    // })
  }

  /**
   * Configures routes
   *
   * @class Server
   * @method routes
   * @return {void}
   */
  private routes(): void {
    // use router middleware
    this.app.use('/', FileRouter)
  }
}

export default new Server().app
