import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  _id         : Schema.Types.ObjectId;
  id          : string;
  writerName  : string;
  content     : string;
  score       : number;
  createdAt   : Date;
  modifiedAt? : Date;
  deletedAt?  : Date;
}

export const commentSchema: Schema = new Schema({
  id         : { type: String, required: true, unique: true },
  writerName : { type: String, required: true },
  content    : { type: String, required: true },
  score      : { type: String, required: true },
  createdAt  : { type: Date, required: true, default: Date.now },
  modifiedAt : { type: Date },
  deletedAt  : { type: Date },
});

export default mongoose.model<IComment>('Comment', commentSchema);
