import flash from 'connect-flash';
import mongo from 'connect-mongo';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import createError from 'http-errors';
import { TokenExpiredError } from 'jsonwebtoken';
import passport from 'passport';
import path from 'path';
import { passportConfig } from './config/passport';
import connect from './connect';
import articleRouter from './routes/article';
import authRouter from './routes/auth';
import indexRouter from './routes/index';
import userRouter from './routes/user';
import { addHours } from './util/datehelper';
import logger from './util/logger';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';

const MongoStore = mongo(session);
const mongoUrl = MONGODB_URI;

connect({db: mongoUrl});
passportConfig(passport);

const app = express();

app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'pug');

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));

// Set cookie expires
app.use((req: Request, res: Response, next: NextFunction) => {
  req.session.cookie.expires = addHours(24);
  req.session.cookie.maxAge = 3600000 * 24;
  next();
});

app.use(cookieParser());
app.use(passport.initialize());

// deserialize 역할을 대신하는 미들웨어
app.use((req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    // 토큰이 만료되었거나, 가지고 있지 않아도 서비스 제공
    if (info instanceof TokenExpiredError || !req.cookies.token) {
      res.cookie('token', '', { maxAge: 0 });
      next();
    } else if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
});

app.use(express.static(path.join(__dirname, '../../src/public')));

// Set flashMessage
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.flashMessage = req.flash('flashMessage');
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/article', articleRouter);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// General error handler
app.use((err, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (res.statusCode === 404) {
    logger.error(`Error message: ${err.message}`);
  } else {
    logger.error(`Error message: ${err.message}\nStacktrace: ${err.stack}`);
  }

  res.status(err.status || 500);
  res.render('error', {
    env: req.app.get('env'),
    errorMessage: err.message,
    stackTrace: err.stack,
    statusCode: err.status,
  });
});

export default app;
