import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INode extends Document {
  name: string;
  parent: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}