import { getScheduleNode } from "./node.js";
import { isValidArray } from "./helper.js";
import { throwWFErrorAndUpdateDB } from "./errors.js";

export const workflowInputvalidation = async (workflowObj) => {
  await nodesNonEmptyCheck(workflowObj);
  await edgesNonEmptyCheck(workflowObj);
  await scheduleNodeCheck(workflowObj);
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
const scheduleNodeCheck = async (workflowObj) => {
  const scheduleNodeObj = getScheduleNode(workflowObj);
  if (!scheduleNodeObj) {
    const message = "Workflow does not have a schedule node";
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
