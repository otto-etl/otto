import express from "express";
const router = express.Router();
import { getExecutions } from "../models/workflowsService.js";

router.get("/:id", async (req, res, next) => {
  const workflowID = req.params.id;
  try {
    const executions = await getExecutions(workflowID);
    res.status(200).send(executions);
  } catch (e) {
    next(e);
  }
});

export default router;
