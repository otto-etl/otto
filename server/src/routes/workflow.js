import express from "express";
const router = express.Router();
import {
  getAllWorkflows,
  getWorkflow,
  updateNodesEdges,
  insertNewWF,
} from "../models/pgService.js";

//get one workflow data
router.get("/:id", async (req, res, next) => {
  const workflowID = req.params.id;
  try {
    const workflowObj = await getWorkflow(workflowID);
    res.status(200).send(workflowObj);
  } catch (e) {
    next(e);
  }
});

//get all workflow data
router.get("/", async (req, res, next) => {
  try {
    const data = await getAllWorkflows();
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { nodes, edges } = req.body;
    await updateNodesEdges({
      workflowID: id,
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
    });
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    const edges = JSON.stringify([]);
    const nodes = JSON.stringify([]);
    const dbData = await insertNewWF(name, nodes, edges);
    res.status(200).json(dbData);
  } catch (e) {
    next(e);
  }
});

export default router;
