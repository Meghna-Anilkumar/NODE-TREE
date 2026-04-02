import mongoose, { Schema } from 'mongoose';
import { INode } from '../interfaces/models/INodeModel';

const NodeModel: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Node',
            default: null,
        },
        children: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Node',
        }],
    },
    { timestamps: true }
);

export default mongoose.model<INode>('Node', NodeModel);