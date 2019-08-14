import { NextFunction, Request, Response } from 'express';
import Article from '../models/article.model';

export const checkArticleOwner = (req: Request, res: Response, next: NextFunction) => {
  Article.findOne({
    _id: req.params.id,
    writerId: req.user.id,
    deletedAt: { $exists: false },
  },
    (err, article) => {
      if (err) {
        next(err);
      } else if (!article) {
        res.status(403).send({message: '이 게시물에 대한 권한이 없습니다.'});
      } else {
        next();
      }
    });
};

export const checkCommentOwner = (req: Request, res: Response, next: NextFunction) => {
  Article.findOne({
    '_id': req.params.articleId,
    'deletedAt': { $exists: false },
    'comments._id': req.params.commentId,
  },
  { 'comments.$': 1 }
  ,
    (err, article) => {
      try {
        if (err) {
          next(err);
        } else if (article.comments[0].writerId != req.user.id) {
          res.status(403).send({message: '이 댓글에 대한 권한이 없습니다.'});
        } else {
          next();
        }
      } catch (error) {
        next(error);
      }
    });
};
