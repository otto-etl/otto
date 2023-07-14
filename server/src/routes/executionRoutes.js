import express from "express";
const router = express.Router();
import { getExecutions } from "../models/workflowsService.js";

let SSERes;
router.get("/:id", async (req, res, next) => {
  console.log("execution route");
  const workflowID = req.params.id;
  try {
    const executions = await getExecutions(workflowID);
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    SSERes = res;
    SSERes.write("data:" + JSON.stringify(executions));
    SSERes.write("\n\n");
    // res.status(200).send(executions);
  } catch (e) {
    next(e);
  }
});

export const getSSERes = () => {
  return SSERes;
};

export default router;
