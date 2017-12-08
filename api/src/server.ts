import { Request, Response, NextFunction } from 'express'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as cookieParser from "cookie-parser"
import * as cors from 'cors'
import * as express from 'express'
import * as helmet from 'helmet'
import * as logger from 'morgan'
import * as mongoose from 'mongoose'
import * as passport from 'passport'
import * as path from 'path'
import * as uaParser from 'ua-parser-js'

// use native ES6 promises instead of mongoose promise library
(<any>mongoose).Promise = global.Promise

import * as CONFIG from '../../common/options/config'

import _HelperRouter from './routers/_HelperRouter'
import AdminRouter from './routers/_admin'

import ConsumerRouter from './routers/ConsumerRouter'

import EventRouter from './routers/EventRouter'
import PostRouter from './routers/PostRouter'

import ActionRouter from './routers/ActionRouter'
import CommentRouter from './routers/CommentRouter'

import {
  USER_NAME, USER_PASSWORD, HOST, PORT, DB_NAME
} from '../../docker/env/development/init'

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
    // setup MongoDB connection
    const AUTH: string = (USER_NAME.length > 0) ? USER_NAME + ":" + USER_PASSWORD + "@" : "",
      MONGODB_URI: string = "mongodb://" + AUTH + HOST + ":" + PORT + "/" + DB_NAME

    logger('MONGODB_URI: ' + MONGODB_URI)

    // connect to mongodb via mongoose
    mongoose.connect(MONGODB_URI || process.env.MONGODB_URI, {useMongoClient: true})

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
    
    // initialize passport
    this.app.use(passport.initialize())
    
    // mount cors
    this.app.use(cors())

    // mount ua info
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      let ua = new uaParser(req.headers['user-agent'].toString());
      req.ua = ua.getResult()

      next()
    })

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
    let router: express.Router
    router = express.Router()

    // use router middleware
    this.app.use('/', router)

    const root = '/api/v1/'

    // helper router - not for production
    this.app.use(root + 'helpers', _HelperRouter)

    // consumer router - use 'users' in url following common practices
    this.app.use(root, ConsumerRouter)

    // service / prodcut supplier router
    // this.app.use(root + 'suppliers', SupplierRouter)

    // post router
    this.app.use(root + 'posts', PostRouter)

    // event router
    this.app.use(root + 'events', EventRouter)

    // store router
    // this.app.use(root + 'stores', StoreRouter)

    // product category router
    // this.app.use(root + 'categories', CategoryRouter)

    // product router
    // this.app.use(root + 'products', ProductRouter)

    // order router
    // this.app.use(root + 'orders', OrderRouter)

    // validation router
    // this.app.use(root + 'validates', ValidateRouter)

    // action router
    this.app.use(root + 'actions', ActionRouter)

    // comment router
    this.app.use(root + 'comments', CommentRouter)

    // platform administrator router
    this.app.use('/api/v1/admin/', AdminRouter)
  }
}

export default new Server().app
