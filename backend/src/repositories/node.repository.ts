import { Types } from 'mongoose';
import NodeModel from '../models/node.model';
import { INodeRepository, ICreateNodeData } from '../interfaces/repositories/INodeRepository';
import { INode } from '../interfaces/models/INodeModel';

export class NodeRepository implements INodeRepository {
  async create(data: ICreateNodeData): Promise<INode> {
    const created = await NodeModel.create(data);
    return created.toObject();
  }

  async findOne(filter: Record<string, any>): Promise<INode | null> {
    return NodeModel.findOne(filter).lean();
  }
  async findById(id: string | Types.ObjectId): Promise<INode | null> {
    return NodeModel.findById(id).lean();
  }

  async findRootNodes(): Promise<INode[]> {
    return NodeModel.find({
      $or: [{ parent: null }, { parent: { $exists: false } }]
    })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findChildren(parentId: string | Types.ObjectId): Promise<INode[]> {
    return NodeModel.find({ parent: new Types.ObjectId(parentId) })
      .sort({ createdAt: -1 })
      .lean();
  }

  async deleteById(id: string | Types.ObjectId): Promise<INode | null> {
    return NodeModel.findByIdAndDelete(id);
  }

  async findAllDescendantIds(nodeId: Types.ObjectId): Promise<Types.ObjectId[]> {
    const descendants: Types.ObjectId[] = [];

    const collect = async (currentId: Types.ObjectId): Promise<void> => {
      const children = await NodeModel.find(
        { parent: currentId },
        { _id: 1 }
      ).lean();

      for (const child of children) {
        const childId = child._id as Types.ObjectId;
        descendants.push(childId);
        await collect(childId);
      }
    };

    await collect(nodeId);
    return descendants;
  }
}