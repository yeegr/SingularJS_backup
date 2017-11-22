import * as passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy}  from 'passport-jwt'
import * as passportOAuth2 from 'passport-oauth2'
import { Strategy as LocalStrategy } from 'passport-local'

import * as CONFIG from '../../../common/options/config'

import Consumer from '../models/ConsumerModel'
import IConsumer from '../interfaces/IConsumer'

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: CONFIG.JWT_SECRET
  }, (payload, done: Function) => {
    Consumer
    .findById(payload.sub)
    .then((user: IConsumer) => {
      if (user) {
        return done(null, user, 'jwt')
      } else {
        return done(null, false)
      }
    })
    .catch((err) => {
      return done(err, false)
    })
  })
)

passport.use(new LocalStrategy({
    usernameField: 'handle'
  }, (handle: string, password: string, done: Function) => {
    Consumer
    .findOne({handle})
    .then((user: IConsumer) => {
      if (user) {
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
          if (err) { return done(err) }
          if (!isMatch) { return done(null, false, {message: 'PASSWORD_INVALID'})}
          return done(null, user, 'local')
        })
      } else {
        return done(null, false, {message: 'USER_NOT_FOUND'})
      }
    })
    .catch((err: Error) => {
      return done(err, false)
    })
  })
)
