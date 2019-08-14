import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { articleUpload, heroImageUpload, markdownUpload } from '../config/multer';

export function articleUploadMiddleware(req: Request, res: Response, next: NextFunction) {
  articleUpload.fields([
    { name: 'markdown', maxCount: 1 },
    { name: 'heroimage', maxCount: 1},
  ])(req, res, err => {
    if (err) {
      createError(500);
      req.flash('flashMessage', '마크다운 업로드에 실패했습니다. 파일 크기(1MB 미만)나 네트워크 회선을 점검해주세요.');
      return res.redirect(req.headers.referer);
    } else {
      next();
    }
  });
}

export function markdownUploadMiddleware(req: Request, res: Response, next: NextFunction) {
  markdownUpload.single('markdown')(req, res, err => {
    if (err) {
      createError(500);
      return res.send({ message: '마크다운 업로드에 실패했습니다.' });
    } else {
      next();
    }
  });
}

export function heroImageUploadMiddleware(req: Request, res: Response, next: NextFunction) {
  heroImageUpload.single('heroimage')(req, res, err => {
    if (err) {
      createError(500);
      return res.send({message: '이미지 업로드에 실패했습니다.'});
    } else {
      next();
    }
  });
}
