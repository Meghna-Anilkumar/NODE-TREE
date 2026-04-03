import { Types } from "mongoose";
import { INode } from "../models/INodeModel";
import { CreateNodeDTO,NodeTreeDTO } from "../../dtos/NodeDTO";

export interface INodeService {
  createNode(data: CreateNodeDTO): Promise<INode>;
  getRootNodes(): Promise<INode[]>;
  getNodeById(id: string): Promise<INode | null>;
  deleteNode(id: string): Promise<boolean>;   
  getChildren(parentId: string): Promise<INode[]>
}