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

import { UTIL, CONFIG } from '../../common'

import _HelperRouter from './routers/_helper'
import AdminRouter from './routers/_admin'

import ConsumerRouter from './routers/ConsumerRouter'

import EventRouter from './routers/EventRouter'
import PostRouter from './routers/PostRouter'

import ActionRouter from './routers/ActionRouter'
import CommentRouter from './routers/CommentRouter'

import * as init from '../../docker/env/development/init.env'

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
  /**
   * 
   * 
   * @memberof Server
   */
  public config(): void {
    // setup MongoDB connection
    const env = UTIL.readEnv(init),
      AUTH: string = (env.USER_NAME.length > 0) ? env.USER_NAME + ":" + env.USER_PASSWORD + "@" : "",
      MONGODB_URI: string = "mongodb://" + AUTH + env.APP_TITLE + "-db" + ":" + env.PORT + "/" + env.DB_NAME,
      DB_URI: string = MONGODB_URI || process.env.MONGODB_URI

    logger('MONGODB_URI: ' + MONGODB_URI)

    let dbConn = () => mongoose.connect(DB_URI, {
      useMongoClient: true,
      autoReconnect: true
    })

    /** 
     * 
    */
    // CONNECTION EVENTS
    let db = mongoose.connection,
      connCounter = 0

    db.on('connecting', () => {
      console.log('Connecting database...')
    })

    db.on('connected', () => {
      console.log('Database connected at ' + MONGODB_URI)
    })

    db.on('error', (err: Error) => {
      console.log('Database connection error: ' + err)

      // db service may not be ready before API server starts, 
      // retry connection if refused
      if (err.message.indexOf('ECONNREFUSED') > -1 && connCounter < CONFIG.DB_CONNECTION_RETRIES) {
        connCounter++
        console.log(`Retry connection number ${connCounter} in ${Math.round(CONFIG.DB_CONNECTION_INTERVAL / 100) / 10}s`)
        setTimeout(dbConn, CONFIG.DB_CONNECTION_INTERVAL)
      }
    })

    db.on('disconnected', () => {
      console.log('Database disconnected')
    })

    db.on('reconnected', () => {
      console.log('Database reconnected')
    })

    db.on('timeout', () => {
      console.log('Database connection timeout')
    })

    db.once('open', () => {
      console.log('Database connection opened')
    })

    // event handler for ECONNREFUSED
    process.on('unhandledRejection', (err: Error) => {
      console.log(err.message)
    })

    // connect to mongodb via mongoose
    dbConn()

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
    this.app.use(root + 'admin', AdminRouter)
  }
}

export default new Server().app
