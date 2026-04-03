import { Request, Response, NextFunction } from "express";
import { INodeController } from "../interfaces/controllers/INodeController";
import { INodeService } from "../interfaces/services/INodeService";
import { CreateNodeDTO, ApiResponse } from "../dtos/NodeDTO";
import { HttpStatus } from "../constants/http.status";

export class NodeController implements INodeController {
  constructor(private readonly _nodeService: INodeService) {}


  async getFullTree(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tree = await this._nodeService.getFullTree();
      console.log('Full tree:',tree)
      const response: ApiResponse<typeof tree> = {
        success: true,
        data: tree,
      };
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  }


  async getRootNodes(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const roots = await this._nodeService.getRootNodes();
      const response: ApiResponse<typeof roots> = {
        success: true,
        data: roots,
      };
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  }


  async getNodeById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const node = await this._nodeService.getNodeById(req.params.id);

      if (!node) {
        const response: ApiResponse<null> = {
          success: false,
          message: "Node not found",
        };
        res.status(HttpStatus.NOT_FOUND).json(response);
        return;
      }

      const response: ApiResponse<typeof node> = {
        success: true,
        data: node,
      };
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  }


  async createNode(
    req: Request<{}, ApiResponse<unknown>, CreateNodeDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, parentId } = req.body;

      if (!name || name.trim() === "") {
        const response: ApiResponse<null> = {
          success: false,
          message: "Node name is required",
        };
        res.status(HttpStatus.BAD_REQUEST).json(response);
        return;
      }

      const node = await this._nodeService.createNode({ name: name.trim(), parentId });

      const response: ApiResponse<typeof node> = {
        success: true,
        message: "Node created successfully",
        data: node,
      };
      res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }


  async deleteNode(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const deleted = await this._nodeService.deleteNode(req.params.id);

      if (!deleted) {
        const response: ApiResponse<null> = {
          success: false,
          message: "Node not found",
        };
        res.status(HttpStatus.NOT_FOUND).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: true,
        message: "Node and all descendants deleted successfully",
      };
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}