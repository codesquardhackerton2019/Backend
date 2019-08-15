import { NextFunction, Request, Response, Router } from 'express';
import commentController, { ICreateCommentInput } from '../controllers/comments';

const commentRouter = Router();

/**
 * @swagger
 * definitions:
 *  comments:
 *   type: object
 *   required:
 *     - id
 *     - writerName
 *     - content
 *     - score
 *     - createdAt
 *   properties:
 *     id:
 *       type: string
 *       description: 객체 식별용 프로퍼티, 객체 생성 시 자동으로 설정
 *     writerName:
 *       type: string
 *       description: 리뷰를 쓴 사람의 닉네임
 *     content:
 *       type: string
 *       description: 리뷰 내용
 *     score:
 *       type: number
 *       format: double
 *       description: 리뷰의 평점
 *     createdAt:
 *       type: Date
 *       description: 식당이 DB에 추가된 날짜
 *     modifiedAt:
 *       type: Date
 *       description: 식당 정보가 수정된 날짜, 리뷰나 메뉴를 추가할 때도 변경됨
 */

commentRouter.post('/stores/:storeId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeInputs: ICreateCommentInput = {
      writerName: req.body.writerName,
      content: req.body.contetn,
      score: parseFloat(req.body.score),
    };
    commentController.createComment(storeInputs, req.params.storeId);

    res.send({
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


export default commentRouter;
