import mongoose, { Document, Schema } from 'mongoose';

export interface IMenu extends Document {
  _id         : Schema.Types.ObjectId;
  id          : number;
  name        : string;
  price       : number;
  createdAt   : Date;
  modifiedAt? : Date;
  deletedAt?  : Date;
}

export const menuSchema: Schema = new Schema({
  id         : { type: Number, required: true, unique: true },
  name       : { type: String, required: true },
  price      : { type: Number, required: true },
  createdAt  : { type: Date, required: true, default: Date.now },
  modifiedAt : { type: Date },
  deletedAt  : { type: Date },
});

export default mongoose.model<IMenu>('Menu', menuSchema);
