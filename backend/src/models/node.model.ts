import mongoose, { Schema, Document, Types } from 'mongoose';
import { INode } from '../interfaces/models/INodeModel';


const nodeSchema = new Schema<INode>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Node',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

nodeSchema.index({ parent: 1 });
nodeSchema.index({ parent: 1, createdAt: -1 });

export default mongoose.model<INode>('Node', nodeSchema);