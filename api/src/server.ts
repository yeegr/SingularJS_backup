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

// use native ES6 promises instead of mongoose promise library
(<any>mongoose).Promise = global.Promise

import _HelperRouter from './routers/_HelperRouter'

import ActionRouter from './routers/ActionRouter'
import ConsumerRouter from './routers/ConsumerRouter'
import EventRouter from './routers/EventRouter'
import PostRouter from './routers/PostRouter'
import CommentRouter from './routers/CommentRouter'

import {
  USER_NAME, USER_PASSWORD, HOST, PORT, DB_NAME
} from '../../docker/env/development/init'

import * as CONFIG from '../../common/options/config'

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

    // cors
    // this.app.use((req, res, next) => {
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

    // helper router - not for production
    this.app.use('/api/v1/helpers', _HelperRouter)

    // consumer router - use 'users' in url following common practices
    this.app.use('/api/v1/users', ConsumerRouter)

    // service / prodcut supplier router
    // this.app.use('/api/v1/suppliers', SupplierRouter)

    // platform administrator router
    // this.app.use('/api/v1/admin', AdminRouter)

    // post router
    this.app.use('/api/v1/posts', PostRouter)

    // event router
    this.app.use('/api/v1/events', EventRouter)

    // store router
    // this.app.use('/api/v1/stores', StoreRouter)

    // product category router
    // this.app.use('/api/v1/categories', CategoryRouter)

    // product router
    // this.app.use('/api/v1/products', ProductRouter)

    // order router
    // this.app.use('/api/v1/orders', OrderRouter)

    // validation router
    // this.app.use('/api/v1/validates', ValidateRouter)

    // action router
    this.app.use('/api/v1/actions', ActionRouter)

    // comment router
    this.app.use('/api/v1/comments', CommentRouter)
  }
}

export default new Server().app
