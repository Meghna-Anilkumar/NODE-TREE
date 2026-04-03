import mongoose, { Schema } from 'mongoose';
import { INode } from '../interfaces/models/INodeModel';

const NodeModel: Schema = new Schema(
 {
    name: {
      type: String,
      required: [true, "Node name is required"],
      trim: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Node",
      default: null,  
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Node",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<INode>('Node', NodeModel);