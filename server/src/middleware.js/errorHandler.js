import { insertNewExecution } from "../models/executionsService.js";
import { NodeError, WorkflowError } from "../utils/errors.js";

export const errorHandler = async (err, req, res, next) => {
  if (err instanceof NodeError || err instanceof WorkflowError) {
    await insertNewExecution("FALSE", err.data);
    res.status(422).json({
      errName: err.name,
      errMessage: err.message,
      body: err.data,
    });
  } else {
    res.status(500).json({ errMessage: err.message });
  }
};
