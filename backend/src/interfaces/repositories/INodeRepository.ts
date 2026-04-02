import { Types } from "mongoose";
import { INode } from "../models/INodeModel";

export interface ICreateNodeData {
  name: string;
  parent?: Types.ObjectId;
  children: Types.ObjectId[];
}

export interface INodeRepository {
  findAll(): Promise<INode[]>;
  findById(id: string | Types.ObjectId): Promise<INode | null>;
  deleteById(id: string | Types.ObjectId): Promise<INode | null>;
  create(data: ICreateNodeData): Promise<INode>;            

  findRootNodes(): Promise<INode[]>;
  findChildren(parentId: string | Types.ObjectId): Promise<INode[]>;
  findAllDescendantIds(nodeId: Types.ObjectId): Promise<Types.ObjectId[]>;

  addChildToParent(
    parentId: Types.ObjectId,
    childId: Types.ObjectId
  ): Promise<void>;

  removeChildFromParent(
    parentId: Types.ObjectId,
    childId: Types.ObjectId
  ): Promise<void>;
}