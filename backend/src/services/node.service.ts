import { Types } from 'mongoose';
import { INodeService } from '../interfaces/services/INodeService';
import { INodeRepository } from '../interfaces/repositories/INodeRepository';
import { CreateNodeDTO } from '../dtos/NodeDTO';
import { AppError } from '../errors/AppError';

export class NodeService implements INodeService {
  constructor(private readonly _nodeRepository: INodeRepository) {}

  async createNode(data: CreateNodeDTO): Promise<any> {
  const { name, parentId } = data;

  if (parentId) {
    const parentExists = await this._nodeRepository.findById(parentId);
    if (!parentExists) {
      throw new AppError('Parent node not found', 404);
    }
  }

  const trimmedName = name.trim();

  const duplicate = await this._nodeRepository.findOne({
    name: trimmedName,
    parent: parentId ? new Types.ObjectId(parentId) : null,
  });

  if (duplicate) {
    throw new AppError(`A node named with this name already exists`, 409);
  }

  const newNode = await this._nodeRepository.create({
    name: trimmedName,
    parent: parentId ? new Types.ObjectId(parentId) : undefined,
  });

  return {
    ...newNode,
    _id: newNode._id.toString(),
    parent: newNode.parent ? newNode.parent.toString() : null,
  };
}

async getRootNodes(): Promise<any[]> {
  const roots = await this._nodeRepository.findRootNodes();
  return roots.map((node) => ({
    _id: node._id.toString(),
    name: node.name,
    parent: node.parent ? node.parent.toString() : null,
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
    children: [],
  }));
}

  async getChildren(parentId: string): Promise<any[]> {
    const children = await this._nodeRepository.findChildren(parentId);
    return children.map((node) => ({
      ...node,
      _id: node._id.toString(),
      parent: node.parent ? node.parent.toString() : null,
    }));
  }

  async getNodeById(id: string): Promise<any | null> {
    const node = await this._nodeRepository.findById(id);
    if (!node) return null;

    return {
      ...node,
      _id: node._id.toString(),
      parent: node.parent ? node.parent.toString() : null,
    };
  }

  async deleteNode(id: string): Promise<boolean> {
    const nodeId = new Types.ObjectId(id);
    const node = await this._nodeRepository.findById(nodeId);

    if (!node) return false;

    const descendantIds = await this._nodeRepository.findAllDescendantIds(nodeId);
    const allIdsToDelete = [nodeId, ...descendantIds];

    await Promise.all(
      allIdsToDelete.map((delId) => this._nodeRepository.deleteById(delId))
    );

    return true;
  }
}