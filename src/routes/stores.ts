import { NextFunction, Request, Response, Router } from 'express';
import storeController, { ICreateStoreInput } from '../controllers/stores';
import { validateCreateInputs } from '../middlewares/stores';
import { IStore } from '../models/store.model';

const storeRouter = Router();

/**
 * @swagger
 * definitions:
 *  stores:
 *   type: object
 *   required:
 *     - name
 *     - tel
 *     - address
 *   properties:
 *     id:
 *       type: string
 *       description: 객체 식별용 프로퍼티, 객체 생성 시 자동으로 설정
 *     name:
 *       type: string
 *       description: 식당 이름
 *     tel:
 *       type: string
 *       description: 식당 전화번호
 *     address:
 *       type: string
 *       description: 식당 주소
 *     totalScore:
 *       type: integer
 *       description: 점수 총합
 *     comments:
 *       type: comment[]
 *       description: 식당 평가의 배열
 */

/**
 * @swagger
 *  /stores:
 *    get:
 *      tags:
 *      - stores
 *      description: 식당 목록 중 일부를 가져온다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *          description: 가져올 페이지의 번호를 적는다. 번호는 1부터 시작한다.
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *          description:  식당 정보의 개수를 적는다.
 *      responses:
 *       200:
 *        description: 식당 정보 리스트가 반환된다.
 *        content:
 *          application/json:
 *            schema:
 *          type: Object
 *          items:
 *           $ref: '#/definitions/boardItem'
 */

storeRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const stores = await storeController.getStores({page, limit});

    res.send({
      stores,
      links: [{
        rel: 'self',
        href: '/stores',
        action: 'POST',
        types: ['application/json'],
      }],
    });
  } catch (error) {
    next(error);
  }
});

storeRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const store = await storeController.getStore(req.params.id);

    res.send({
      store,
      links: [
        {
          rel: 'self',
          href: '/stores',
          action: 'POST',
          types: ['application/json'],
        }
      ],
    });
  } catch (error) {
    next(error);
  }
});

storeRouter.post('/', validateCreateInputs, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeInputs: ICreateStoreInput = {
      name: req.params.name,
      address: req.params.address,
      tel: req.params.tel,
      imageUrl: req.params.imageUrl,
    };
    const store: IStore = await storeController.createStore(storeInputs);

    res.send({
      store,
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


export default storeRouter;
