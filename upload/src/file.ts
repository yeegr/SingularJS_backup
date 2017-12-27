import { Request, Response, NextFunction, Router } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as sharp from 'sharp'
import * as formidable from 'formidable'
import { Fields, Files, IncomingForm } from 'formidable'
import * as mv from 'mv'
import * as randomstring from 'randomstring'

import { CONFIG, UTIL, ERRORS } from '../../common/'

/**
 * FileRouter class
 *
 * @class FileRouter
 */
class FileRouter {
  public router: Router

  /**
   * Constructor
   *
   * @class FileRouter
   * @constructor
   */
  constructor() {
    this.router = Router()
  }

  private resizer = (initPath: string, type: string = 'AVATAR') => {
    let arr = CONFIG.IMAGE_SIZES[type.toUpperCase()],
      [first, last] = UTIL.splitString(initPath, initPath.lastIndexOf('.'))

    arr.forEach((set: number[]) => {
      let filePath = first + '@' + set[0].toString() + 'x' + set[1].toString() + last

      sharp(initPath)
      .resize(set[0], set[1])
      .toFile(filePath, (err, info) => {
        if (err) console.log(err)
      })
    })
  }

  private upload = (req: Request, res: Response, next: NextFunction) => {
    const that = this

    let form: IncomingForm = new IncomingForm(),
      files: string[] = [],
      fields: any = {
        type: 'avatar',
        path: '/'
      }

    // allow multiple files to be uploaded in a single request
    form.multiples = true

    form
    .on('field', (field: Fields, value) => {
      fields[field.toString()] = value
    })
    .on('file', (field: Fields, file: any) => {
      let dest: string = path.join(__dirname, 'uploads', fields.path, file.name)

      // move file from /tmp to destination, retaining original name
      mv(file.path, dest, {mkdirp: true}, (err: Error) => {
        if (err) {
          console.log(err)
        } else {
          that.resizer(dest, fields.type)
        }
      })

      files.push(file.name)
    })
    .on('end', () => {
      res.status(201).json({ files })
    })
    .on('error', (err: Error) => {
      console.log(err)
    })
    
    form.parse(req)
  }

  /**
   * Configures routes
   *
   * @class FileRouter
   * @method routes
   * @return {void}
   */
  public routes(): void {
    // user router
    this.router.post('/', this.upload)
  }
}

// export
const fileRouter = new FileRouter()
fileRouter.routes()
const thisRouter = fileRouter.router

export default thisRouter
