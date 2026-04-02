import { Types } from "mongoose";
import { INode } from "../interfaces/models/INodeModel";
import { INodeRepository, ICreateNodeData } from "../interfaces/repositories/INodeRepository";
import NodeModel from "../models/node.model";
export class NodeRepository implements INodeRepository {
  


  async findAll(filter?: Partial<INode>): Promise<INode[]> {
    return NodeModel.find();
  }

  async findById(id: string | Types.ObjectId): Promise<INode | null> {
    return NodeModel.findById(id);
  }

  async deleteById(id: string | Types.ObjectId): Promise<INode | null> {
    return NodeModel.findByIdAndDelete(id);
  }

  async create(data: ICreateNodeData): Promise<INode> {
    return NodeModel.create(data);
  }


  async findRootNodes(): Promise<INode[]> {
    return NodeModel.find({ parent: { $exists: false } });
  }

  async findChildren(parentId: string | Types.ObjectId): Promise<INode[]> {
    return NodeModel.find({ parent: new Types.ObjectId(parentId) });
  }

  async findAllDescendantIds(nodeId: Types.ObjectId): Promise<Types.ObjectId[]> {
    const descendants: Types.ObjectId[] = [];

    const collect = async (currentId: Types.ObjectId): Promise<void> => {
      const children = await NodeModel.find(
        { parent: currentId },
        { _id: 1 }   
      );

      for (const child of children) {
        const childId = child._id as Types.ObjectId;
        descendants.push(childId);
        await collect(childId); 
      }
    };

    await collect(nodeId);
    return descendants;
  }


  async addChildToParent(
    parentId: Types.ObjectId,
    childId: Types.ObjectId
  ): Promise<void> {
    await NodeModel.findByIdAndUpdate(
      parentId,
      { $push: { children: childId } }
    );
  }

  async removeChildFromParent(
    parentId: Types.ObjectId,
    childId: Types.ObjectId
  ): Promise<void> {
    await NodeModel.findByIdAndUpdate(
      parentId,
      { $pull: { children: childId } }
    );
  }
}