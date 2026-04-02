import { Types } from "mongoose";
import { INode } from "../interfaces/models/INodeModel";
import { INodeService } from "../interfaces/services/INodeService";
import { INodeRepository } from "../interfaces/repositories/INodeRepository";
import { CreateNodeDTO, NodeTreeDTO } from "../dtos/NodeDTO";


class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NodeService implements INodeService {
  constructor(private readonly nodeRepository: INodeRepository) {}

  async createNode(data: CreateNodeDTO): Promise<INode> {
    const { name, parentId } = data;

    if (parentId) {
      const parentNode = await this.nodeRepository.findById(parentId);
      if (!parentNode) {
        throw new AppError("Parent node not found", 404);
      }
    }

    const parent = parentId ? new Types.ObjectId(parentId) : undefined;

    const newNode = await this.nodeRepository.create({
      name,
      parent,
      children: [],
    });

    if (parent) {
      await this.nodeRepository.addChildToParent(
        parent,
        newNode._id as Types.ObjectId
      );
    }

    return newNode;
  }

  async getAllNodes(): Promise<INode[]> {
    return this.nodeRepository.findAll();
  }

  async getRootNodes(): Promise<INode[]> {
    return this.nodeRepository.findRootNodes();
  }

  async getNodeById(id: string): Promise<INode | null> {
    return this.nodeRepository.findById(id);
  }

  async getFullTree(): Promise<NodeTreeDTO[]> {
    const roots = await this.nodeRepository.findRootNodes();
    return Promise.all(roots.map((root) => this.buildTree(root)));
  }

  async deleteNode(id: string): Promise<boolean> {
    const nodeId = new Types.ObjectId(id);

    const node = await this.nodeRepository.findById(nodeId);
    if (!node) return false;

    if (node.parent) {
      await this.nodeRepository.removeChildFromParent(
        node.parent as Types.ObjectId,
        nodeId
      );
    }

    const descendantIds = await this.nodeRepository.findAllDescendantIds(nodeId);
    const allIds = [nodeId, ...descendantIds];

    await Promise.all(allIds.map((descId) => this.nodeRepository.deleteById(descId)));

    return true;
  }

  async getAllDescendantIds(nodeId: string): Promise<Types.ObjectId[]> {
    return this.nodeRepository.findAllDescendantIds(new Types.ObjectId(nodeId));
  }



  private async buildTree(node: INode): Promise<NodeTreeDTO> {
    const children = await this.nodeRepository.findChildren(
      node._id as Types.ObjectId
    );

    const childTrees = await Promise.all(
      children.map((child) => this.buildTree(child))
    );

    return {
      _id: (node._id as Types.ObjectId).toString(),
      name: node.name,
      parent: node.parent ? node.parent.toString() : null,
      children: childTrees,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
    };
  }
}