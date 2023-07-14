import {
  updateWorkflowError,
  updateNodes,
} from "../models/workflowsService.js";

export class NodeError extends Error {
  constructor(message, data) {
    super(message);
    this.name = "NodeError";
    this.data = data;
  }
}

export class WorkflowError extends Error {
  constructor(message, data) {
    super(message);
    this.name = "WorkflowError";
    this.data = data;
  }
}

export class InternalError extends NodeError {
  constructor(message, data) {
    super(message, data);
    this.name = "InternalError";
  }
}

export class ExternalError extends NodeError {
  constructor(message, data) {
    super(message, data);
    this.name = "ExternalError";
  }
}

export const throwWFErrorAndUpdateDB = async (workflowObj, errMessage) => {
  workflowObj.error = {
    name: "WorkflowError",
    message: errMessage,
  };
  await updateWorkflowError(workflowObj.id, workflowObj.error);
  throw new WorkflowError(errMessage, workflowObj);
};

export const throwNDErrorAndUpdateDB = async (
  workflowObj,
  nodeObj,
  errMessage
) => {
  nodeObj.data.error = {
    name: "NodeError",
    message: errMessage,
  };
  await updateNodes(workflowObj);
  throw new NodeError(errMessage, workflowObj);
};

export const throwEXErrorAndUpdateDB = async (
  workflowObj,
  nodeObj,
  errMessage
) => {
  nodeObj.data.error = {
    name: "ExternalError",
    message: errMessage,
  };
  await updateNodes(workflowObj);
  throw new ExternalError(errMessage, workflowObj);
};
