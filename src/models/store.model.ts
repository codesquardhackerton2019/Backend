import mongoose, { Document, Schema } from 'mongoose';
import { commentSchema, IComment } from './comment.model';
import { IMenu, menuSchema } from './menu.model';

export interface IStore extends Document {
  _id         : Schema.Types.ObjectId;
  id          : string;
  name        : string;
  tel         : string;
  address     : string;
  totalScore  : number;
  imageUrl    : string;
  comments    : [IComment];
  menus       : [IMenu];
  createdAt   : Date;
  modifiedAt? : Date;
  deletedAt?  : Date;
}

export const storeSchema: Schema = new Schema({
  id         : { type: String, required: true, unique: true },
  name       : { type: String, required: true },
  tel        : { type: String, required: true },
  address    : { type: String, required: true },
  totalScore : { type: Number, required: true, default: 0 },
  comments   : { type: [commentSchema], required: true, default: [] },
  menus      : { type: [menuSchema], required: true, default: [] },
  imageUrl   : { type: String },
  createdAt  : { type: Date, required: true, default: Date.now },
  modifiedAt : { type: Date },
  deletedAt  : { type: Date },
});

export default mongoose.model<IStore>('Store', storeSchema);
