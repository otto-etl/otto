import express from "express";
const router = express.Router();
import { getMetricsForWorkflow } from "../models/workflowsService.js";

router.get("/:id", async (req, res, next) => {
  const workflowID = req.params.id;
  try {
    const metrics = await getMetricsForWorkflow(workflowID);
    res.status(200).send(metrics);
  } catch (e) {
    next(e);
  }
});

export default router;