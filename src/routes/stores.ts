import { NextFunction, Request, Response, Router } from 'express';
import storeController from '../controllers/stores';

const storeRouter = Router();

storeRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const stores = storeController.getStores({page, limit});

    res.send({
      stores,
      links: {
        rel: 'self',
        href: '/stores',
        action: 'POST',
        types: ['application/x-www-form-urlencoded', 'application/json'],
      },
    });
  } catch (error) {
    next(error);
  }
});

export default storeRouter;
