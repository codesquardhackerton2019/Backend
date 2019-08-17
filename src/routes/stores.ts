import { NextFunction, Request, Response, Router } from 'express';
import storeController, { ICreateStoreInput } from '../controllers/stores';
import { validateCreateInputs, validateGetInputs } from '../middlewares/stores';
import { IStore } from '../models/store.model';

const storeRouter = Router();

/**
 * @swagger
 * definitions:
 *  stores:
 *   type: object
 *   required:
 *     - id
 *     - name
 *     - tel
 *     - address
 *     - totalScore
 *     - commentSize
 *     - imageUrl
 *     - createdAt
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
 *       description: 식당 평가의 배열, 목록 조회 시 제외됨
 *     commentSize:
 *       type: integer
 *       description: 댓글 개수
 *     imageUrl:
 *       type: string
 *       description: 식당 사진 url
 *     description:
 *       type: string
 *       description: 식당 한줄 평
 *     menus:
 *       type: menu[]
 *       description: 식당의 메뉴 배열, 목록 조회 시 제외됨
 *     createdAt:
 *       type: Date
 *       description: 식당이 DB에 추가된 날짜
 *     modifiedAt:
 *       type: Date
 *       description: 식당 정보가 수정된 날짜, 리뷰나 메뉴를 추가할 때도 변경됨
 */

/**
 * @swagger
 *  /stores/recommand:
 *    get:
 *      tags:
 *      - stores
 *      description: 추천 식당 조회
 *      produces:
 *      - applicaion/json
 *      responses:
 *       200:
 *        description: 추천할 식당 정보 리스트가 반환된다.
 *        content:
 *          application/json:
 *            schema:
 *          type: Object
 *          items:
 *           $ref: '#/definitions/stores'
 */

storeRouter.get('/recommand', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stores = await storeController.getRecommandation();

    res.send({
      stores,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 *  /stores:
 *    get:
 *      tags:
 *      - stores
 *      description: 식당의 목록을 가져온다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *        - in: query
 *          name: size
 *          schema:
 *            type: integer
 *          required: true
 *          description: 식당 목록 개수
 *      responses:
 *       200:
 *        description: 식당 정보가 배열로 반환된다.
 *        content:
 *          application/json:
 *            schema:
 *          type: Object
 *          items:
 *           $ref: '#/definitions/stores'
 */

storeRouter.get('/', validateGetInputs, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stores = await storeController.getStores(req.query.size);

    res.send({
      stores,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 *  /stores/{storeId}:
 *    get:
 *      tags:
 *      - stores
 *      description: 식당의 상세 정보(메뉴, 댓글 포함)를 가져온다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *        - in: path
 *          name: storeId
 *          schema:
 *            type: string
 *          required: true
 *          description: 상세 정보를 볼 식당의 id
 *      responses:
 *       200:
 *        description: 식당 정보가 반환된다.
 *        content:
 *          application/json:
 *            schema:
 *          type: Object
 *          items:
 *           $ref: '#/definitions/stores'
 */

storeRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const store = await storeController.getStore(req.params.id);

    res.send({
      store,
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
    });
  } catch (error) {
    next(error);
  }
});


export default storeRouter;
