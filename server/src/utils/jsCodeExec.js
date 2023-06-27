import vm from "vm";
import { getNode } from "./node.js";

export const runJSCode = async (workflowID, node) => {
  console.log("currentNode", node);
  const previousNode = await getNode(workflowID, node.data.prev);
  console.log("prev node", previousNode);
  const customCode = node.data.jsCode;
  const inputData = previousNode.data.output;
  if (!inputData) {
    throw new Error("No data from previous node");
  }
  vm.createContext(inputData);
  vm.runInContext(customCode, inputData);
  console.log(inputData);
  return inputData;
};
