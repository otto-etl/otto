import { insertNewExecution } from "../models/workflowsService.js";
import { NodeError, WorkflowError } from "../utils/errors.js";
import { getSSERes } from "../routes/executionRoutes.js";
export const errorHandler = async (err, req, res, next) => {
  if (err instanceof NodeError || err instanceof WorkflowError) {
    if (err.data.startTime) {
      const newExecution = await insertNewExecution("FALSE", err.data);
      const SSERes = getSSERes();
      SSERes.write("data:" + JSON.stringify(newExecution));
      SSERes.write("\n\n");
    }
    res.status(422).json({
      errName: err.name,
      errMessage: err.message,
      body: err.data,
    });
  } else {
    res.status(500).json({ errMessage: err.message });
  }
};
