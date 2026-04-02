import { Router } from "express";
import { NodeRepository } from "../repositories/node.repository";
import { NodeService } from "../services.ts/node.service";
import { NodeController } from "../controllers/node.controller";
import { NODE_ROUTES } from "../constants/node.routes";

const router = Router();


const nodeRepository = new NodeRepository();
const nodeService = new NodeService(nodeRepository);
const nodeController = new NodeController(nodeService);


router.get(NODE_ROUTES.GET_TREE, nodeController.getFullTree.bind(nodeController));
router.get(NODE_ROUTES.GET_ROOTS, nodeController.getRootNodes.bind(nodeController));
router.get(NODE_ROUTES.GET_BY_ID, nodeController.getNodeById.bind(nodeController));
router.post(NODE_ROUTES.CREATE, nodeController.createNode.bind(nodeController));
router.delete(NODE_ROUTES.DELETE, nodeController.deleteNode.bind(nodeController));

export default router;