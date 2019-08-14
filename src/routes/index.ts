import { NextFunction, Request, Response, Router } from 'express';
import createError from 'http-errors';
import { googleAuthUrl } from '../config/oauth';
import { GOOGLE_CLIENT_ID } from '../util/secrets';

const homeRouter = Router();

homeRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.render('block/article-list', {
      user: req.user,
      googleClientId: GOOGLE_CLIENT_ID,
      googleAuthUrl,
    });
  } catch (error) {
    createError(500);
    next(error);
  }
});

export default homeRouter;
