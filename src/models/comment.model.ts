import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface IComment extends Document {
  _id         : Schema.Types.ObjectId;
  writerId    : IUser['_id'];
  content     : string;
  createdAt   : Date;
  modifiedAt? : Date;
  deletedAt?  : Date;
  likeUsers   : [Schema.Types.ObjectId];
  children    : [IComment];
}

export const commentSchema: Schema = new Schema({
  writerId     : { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  content      : { type: Schema.Types.String, required: true },
  createdAt    : { type: Schema.Types.Date, required: true },
  modifiedAt   : { type: Schema.Types.Date },
  deletedAt    : { type: Schema.Types.Date },
  likeUsers    : { type: Array, default: [], ref: 'User'},
  children     : { type: Array, default: []},
});

export default mongoose.model<IComment>('Comment', commentSchema);
