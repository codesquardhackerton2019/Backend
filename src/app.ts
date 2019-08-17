import axios from 'axios';
import flash from 'connect-flash';
import mongo from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import createError from 'http-errors';
import path from 'path';
import qs from 'querystring';
import request from 'request';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOption from './config/swagger';
import connect from './connect';
import Store from './models/store.model';
import mockRouter from './routes/mock';
import storeRouter from './routes/stores';
import logger from './util/logger';
import { KAKAO_KEY, MONGODB_URI, SESSION_SECRET, SLACK_AUTH_TOKEN, SLACK_DEST_ROOM } from './util/secrets';
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
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${qs.escape(store[0].name)}&x=127.03342973835&y=37.4908543445167&radius=20000`;
    const axiosResult = await axios(
      {
        url,
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${KAKAO_KEY}`
        }
      });
    const data = {
      form: {
        token: SLACK_AUTH_TOKEN,
        channel: SLACK_DEST_ROOM,
        text: `${store[0].name}\n${axiosResult.data.documents[0].place_url.replace('http', 'https')}`,
        unfurl_links: true,
        unfurl_media: true,
      }
    };
    request.post('https://slack.com/api/chat.postMessage', data, (error, response, body) => {
      res.json();
    });
  } catch (error) {
    res.status(500).send({message: 'error occur'});
  }
});

app.use('/kakao', async (req, res) => {
  try {
    const name = '코드스쿼드';

    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${qs.escape(name)}}`;
    const axiosResult = await axios(
      {
        url,
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${KAKAO_KEY}`
        }
      });

    res.send({data: axiosResult.data});
  } catch (error) {
    console.log(error);
    res.status(500).send({message: '실패'});
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
