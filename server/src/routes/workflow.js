import express from "express";
const router = express.Router();
import {
  getAllWorkflows,
  getWorkflow,
  updateNodesEdges,
} from "../models/pgService.js";

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { nodes, edges } = await getWorkflow(id);
    res.status(200).json({ id, nodes, edges });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await getAllWorkflows();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { nodes, edges } = req.body;
    await updateNodesEdges({ workflowID: id, nodes, edges });
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
