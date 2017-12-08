import * as passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy}  from 'passport-jwt'
import * as passportOAuth2 from 'passport-oauth2'
import { Strategy as LocalStrategy } from 'passport-local'

import { CONFIG, CONST, ERRORS } from '../../../../common'

import Platform, { IPlatform } from '../../models/users/PlatformModel'

passport.use('platformJwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: CONFIG.JWT_SECRETS.PLATFORM
  }, (payload, done: Function) => {
    Platform
    .findOne({
      _id: payload.sub,
      status: CONST.STATUSES.PLATFORM.ACTIVE
    })
    .then((user: IPlatform) => {
      if (user) {
        return done(null, user, 'jwt')
      } else {
        return done(null, false)
      }
    })
    .catch((err: Error) => {
      return done(err, false)
    })
  })
)

passport.use('platformLocal', new LocalStrategy((username: string, password: string, done: Function) => {
    Platform
    .findOne({
      username,
      status: CONST.STATUSES.PLATFORM.ACTIVE
    })
    .then((user: IPlatform) => {
      if (user) {
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
          if (err) { return done(err) }
          if (!isMatch) { return done(null, false, {message: ERRORS.USER.PASSWORD_INCORRECT })}
          return done(null, user, 'local')
        })
      } else {
        return done(null, false, { message: ERRORS.USER.USER_NOT_FOUND })
      }
    })
    .catch((err: Error) => {
      return done(err, false)
    })
  })
)
