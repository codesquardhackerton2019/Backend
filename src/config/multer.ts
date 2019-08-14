import { Request } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { S3_BUCKET } from '../util/secrets';
import s3 from './aws';

export type RequestS3 = Request & {
  file  : Express.MulterS3.File,
  files : {
    [fieldname: string]: Express.MulterS3.File[];
  } | Express.MulterS3.File[];
};

const uploadBasePath = 'original';
const profileImagePath = 'profile';
const markdownUploadPath = 'md';

function multerFactory (destinationPath, limitFileSize): multer.Instance {
  return multer({
    storage: multerS3({
      s3,
      bucket: S3_BUCKET,
      key(req, file, cb) {
        cb(undefined, path.join(destinationPath, `${Date.now()}${path.basename(file.originalname)}`));
      },
    }),
    limits: { fileSize: limitFileSize },
  });
}

export const profileUpload: multer.Instance = multerFactory(path.join(uploadBasePath, profileImagePath), '1MB');
export const articleUpload: multer.Instance = multerFactory(path.join(uploadBasePath, markdownUploadPath), '16MB');
export const markdownUpload: multer.Instance = multerFactory(path.join(uploadBasePath, markdownUploadPath), '1MB');
export const heroImageUpload: multer.Instance = multerFactory(path.join(uploadBasePath, markdownUploadPath), '15MB');
