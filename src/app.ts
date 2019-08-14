import flash from 'connect-flash';
import mongo from 'connect-mongo';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import createError from 'http-errors';
import path from 'path';
import connect from './connect';
import storeRouter from './routes/stores';
import logger from './util/logger';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';

const MongoStore = mongo(session);
const mongoUrl = MONGODB_URI;

connect({db: mongoUrl});

const app = express();

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

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../../src/public')));

// Set flashMessage
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.flashMessage = req.flash('flashMessage');
  next();
});

app.use('/stores', storeRouter);

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

  res.status(err.status || 500).send({
    errorMessage: err.message,
  });
});

export default app;
