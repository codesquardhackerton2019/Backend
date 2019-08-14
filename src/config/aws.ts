import AWS from 'aws-sdk';
import { S3_ACCESS_KEY_ID, S3_REGION, S3_SECRET_ACCESS_KEY } from '../util/secrets';

AWS.config.update({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  region: S3_REGION,
});

const s3 = new AWS.S3();

export default s3;
