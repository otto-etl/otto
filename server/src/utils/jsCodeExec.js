import vm from "vm";
import { getNode } from "./node.js";
import { updateWorkflowNodes } from "../models/pgService.js";

export const runJSCode = async (workflowObj, nodeObj) => {
  const prevNodeID = nodeObj.data.prev;
  const previousNode = getNode(workflowObj, prevNodeID);
  const customCode = nodeObj.data.jsCode;
  const inputData = JSON.parse(JSON.stringify(previousNode.data.output));
  if (!inputData) {
    throw new Error("No data from previous node");
  }
  vm.createContext(inputData);
  vm.runInContext(customCode, inputData);
  nodeObj.data.output = inputData;
  await updateWorkflowNodes(workflowObj);
  return inputData;
};
