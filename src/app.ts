import flash from 'connect-flash';
import mongo from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import createError from 'http-errors';
import path from 'path';
import request from 'request';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOption from './config/swagger';
import connect from './connect';
import Store from './models/store.model';
import mockRouter from './routes/mock';
import storeRouter from './routes/stores';
import logger from './util/logger';
import { MONGODB_URI, SESSION_SECRET, SLACK_AUTH_TOKEN } from './util/secrets';
import swaggerUiExpress = require('swagger-ui-express');

const MongoStore = mongo(session);
const mongoUrl = MONGODB_URI;

connect({db: mongoUrl});

const app = express();
const specs = swaggerJSDoc(swaggerOption);

app.use(cors());
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
app.use('/mock', mockRouter);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use('/slack/recommands', async (req, res) => {
  try {
    const store = await Store.aggregate([
      { $match: { deletedAt: { $exists: false } } },
      { $sample: { size: 1 } },
      { $project: {
        _id: 0,
        name: 1,
      }},
    ]);
    const data = {
      form: {
        token: SLACK_AUTH_TOKEN,
        channel: '#잡담',
        text: `${store[0].name}\nhttps://www.google.com/search?q=${store[0].name.split(' ').join('+')}`
      }
    };
    request.post('https://slack.com/api/chat.postMessage', data, (error, response, body) => {
        res.json();
    });
  } catch (error) {
    res.status(500).send({message: 'error occur'});
  }
});

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
