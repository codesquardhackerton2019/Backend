import mongoose, { Document, Schema } from 'mongoose';
import { commentSchema, IComment } from './comment.model';
import { IUser } from './user.model';

export interface IArticle extends Document {
  _id          : Schema.Types.ObjectId;
  title        : string;
  markdownKey  : string;
  heroImageUrl : string;
  writerId     : IUser['_id'];
  hits         : number;
  createdAt    : Date;
  modifiedAt   : Date;
  deletedAt    : Date;
  likeUsers    : [Schema.Types.ObjectId];
  comments     : [IComment];
}

const articleSchema: Schema = new Schema({
  title        : { type: Schema.Types.String, required: true },
  markdownKey  : { type: Schema.Types.String, required: true },
  heroImageUrl : { type: Schema.Types.String, required: true },
  writerId     : { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  hits         : { type: Schema.Types.Number, required: true },
  createdAt    : { type: Schema.Types.Date, required: true },
  modifiedAt   : { type: Schema.Types.Date },
  deletedAt    : { type: Schema.Types.Date },
  likeUsers    : { type: Array, default: [], ref: 'User' },
  comments     : { type: [commentSchema] , default: [] },
});

export default mongoose.model<IArticle>('Article', articleSchema);
