import { Request, Response, NextFunction } from "express";

export interface INodeController {
  getRootNodes(req: Request, res: Response, next: NextFunction): Promise<void>;
  createNode(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteNode(req: Request, res: Response, next: NextFunction): Promise<void>;
}