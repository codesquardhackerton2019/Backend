import { NextFunction, Request, Response, Router } from 'express';
import fs from 'fs';
import ReadLine from 'readline';
import uniqid from 'uniqid';
import Store from '../models/store.model';

const mockRouter = Router();

// mockRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { page, limit } = req.query;
//     const stores = storeController.getStores({page, limit});

//     res.send({
//       stores,
//       links: {
//         rel: 'self',
//         href: '/stores',
//         action: 'POST',
//         types: ['application/x-www-form-urlencoded', 'application/json'],
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

mockRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mockDataReadStream =
      fs.createReadStream('/Users/mcc/Workspace/codesquad/repo/hackerton-815/storeMock.csv');

    const readLine = ReadLine.createInterface({
      input: mockDataReadStream
    });

    readLine.on('line', line => {
      const inputs = line.split(',');
      const store = new Store({
        id: uniqid(),
        name: inputs[0],
        tel: inputs[1],
        address: inputs[2],
        imageUrl: inputs[3],
      });
      store.save((err, product) => {
        console.log(err);
      });
    });

    res.status(202).send({
      links: {
        rel: 'self',
        href: '/stores',
        action: 'GET',
      },
    });
  } catch (error) {
    next(error);
  }
});

mockRouter.delete('/removeAll', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Store.deleteMany({});

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// mockRouter.post('/comments/:id', async (req: Request, res: Response, next: NextFunction) => {
//   try {

//   } catch (error) {
//     next(error);
//   }
// });

export default mockRouter;
