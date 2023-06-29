import express from "express";
const router = express.Router();
import { getAllWorkflows, getWorkflow } from "../models/pgService.js";

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getWorkflow(id);
    res.status(200).json(data);
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

export default router;
