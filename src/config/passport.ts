import { Request } from 'express';
import { PassportStatic } from 'passport';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import User, { IUser, IUserScheme } from '../models/user.model';
import { JWT_SECRET } from '../util/secrets';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const JWTOptions = {
  jwtFromRequest: (req: Request) => req ? req.cookies.token : undefined,
  secretOrKey: JWT_SECRET,
};

export const passportConfig = (passport: PassportStatic) => {
  // 최초 로그인할 때 실행
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user: IUserScheme) => {
      if (err) { return done(err); }
      if (!user) {
        return done(undefined, false, { message: '일치하는 정보가 없습니다.' });
      }
      user.comparePassword(password, (err: Error, isMatch: boolean) => {
        if (err) { return done(err); }
        if (isMatch) {
          return done(undefined, user);
        }
        return done(undefined, false, { message: '일치하는 정보가 없습니다.' });
      });
    });
  }));

  // 매 요청마다 실행
  passport.use(new JWTStrategy(JWTOptions, (jwtPayload, done) => {
    User.findOne({ email: jwtPayload.email }, (err, user: IUser) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(undefined, user);
      } else {
        return done(undefined, false);
      }
    });
  }));
};
