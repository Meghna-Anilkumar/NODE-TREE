import mongoose, {Document } from 'mongoose';

export interface INode extends Document {
  name: string;
  parent?: mongoose.Types.ObjectId;
  children: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}