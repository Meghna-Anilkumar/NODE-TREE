import { Types } from "mongoose";
import { INode } from "../models/INodeModel";

export interface ICreateNodeData {
  name: string;
  parent?: Types.ObjectId;
  children?: Types.ObjectId[];  
}

export interface INodeRepository {
  findById(id: string | Types.ObjectId): Promise<INode | null>;
  findOne(filter: Record<string, any>): Promise<INode | null>;
  deleteById(id: string | Types.ObjectId): Promise<INode | null>;
  create(data: ICreateNodeData): Promise<INode>;            
  findRootNodes(): Promise<INode[]>;
  findChildren(parentId: string | Types.ObjectId): Promise<INode[]>;
  findAllDescendantIds(nodeId: Types.ObjectId): Promise<Types.ObjectId[]>
}