import { getTriggerNode } from "./node.js";
import { isValidArray } from "./helper.js";
import { throwWFErrorAndUpdateDB } from "./errors.js";

export const workflowInputvalidation = async (workflowObj) => {
  await nodesNonEmptyCheck(workflowObj);
  await edgesNonEmptyCheck(workflowObj);
  await triggerNodeCheck(workflowObj);
  await workflowActiveCheck(workflowObj);
};

const nodesNonEmptyCheck = async (workflowObj) => {
  if (!isValidArray(workflowObj.nodes)) {
    const message = "Nodes can not be empty";
    await throwWFErrorAndUpdateDB(workflowObj, message);
  }
};

const edgesNonEmptyCheck = async (workflowObj) => {
  if (!isValidArray(workflowObj.edges)) {
    const message = "Edges can not be empty";
    await throwWFErrorAndUpdateDB(workflowObj, message);
  }
};

//this is not necessary once algo is changed
const triggerNodeCheck = async (workflowObj) => {
  const triggerNodeObj = getTriggerNode(workflowObj);
  if (!triggerNodeObj) {
    const message = "Workflow does not have a trigger node";
    await throwWFErrorAndUpdateDB(workflowObj, message);
  }
};

const workflowActiveCheck = async (workflowObj) => {
  const values = [true, false];
  if (!values.includes(workflowObj.active)) {
    const message = "invalid workflow status";
    await throwWFErrorAndUpdateDB(workflowObj, message);
  }
};
