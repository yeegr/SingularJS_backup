import { Request, Response, NextFunction, Router } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as sharp from 'sharp'
import * as formidable from 'formidable'
import { Fields, Files, IncomingForm } from 'formidable'
import * as mv from 'mv'
import * as randomstring from 'randomstring'

import { CONST, UTIL, ERRORS } from '../../common/'

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

  private resizer = (initPath: string, set: [number, number, boolean]) => {
    let [width, height, isThumb] = set,
      [first, last] = UTIL.splitString(initPath, initPath.lastIndexOf('.')),
      txt = (height === null) ? '' : ('x' + height.toString()),
      tmp = isThumb ? CONST.THUMBNAIL : ('@' + width.toString() + txt),
      finalPath = first + tmp + last

    sharp(initPath)
    .resize(width, height)
    .toFile(finalPath, (err, info) => {
      if (err) console.log(err)
    })
  }

  private processor = (initPath: string, type: string = 'AVATAR') => {
    let that = this,
      arr = CONST.IMAGE_SIZES[type.toUpperCase()],
      [first, last] = UTIL.splitString(initPath, initPath.lastIndexOf('.'))

    arr.forEach((set: [number, number, boolean]) => {
      that.resizer(initPath, set)
    })
  }

  private post = (req: Request, res: Response, next: NextFunction) => {
    const that = this

    let form: IncomingForm = new IncomingForm(),
      files: any[] = [],
      fields: any = {
        type: CONST.IMAGE_TYPES.AVATAR,
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
          that.processor(dest, fields.type)
        }
      })

      files.push({
        path: file.name,
        thumb: UTIL.spliceString(file.name, file.name.lastIndexOf('.'), CONST.THUMBNAIL)
      })
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
    // post router
    this.router.post('/', this.post)
  }
}

// export
const fileRouter = new FileRouter()
fileRouter.routes()
const thisRouter = fileRouter.router

export default thisRouter
