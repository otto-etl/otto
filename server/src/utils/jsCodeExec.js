import vm from "vm";
import { updateNodes } from "../models/pgService.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";
import { getMultipleInputData } from "./node.js";
import { nodeInputvalidation } from "./nodeInput.js";

export const runJSCode = async (workflowObj, nodeObj) => {
  await nodeInputvalidation(workflowObj, nodeObj);

  const customCode = nodeObj.data.jsCode;
  //this function also throws NodeError if any previous node is missing input data
  let inputData = await getMultipleInputData(workflowObj, nodeObj);
  inputData;

  try {
    vm.createContext(inputData);
    vm.runInContext(customCode, inputData);
  } catch (e) {
    const message = `JS code execution failed with error ${e.message}`;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }

  nodeObj.data.output = { data: inputData.data };
  nodeObj.data.error = null;
  await updateNodes(workflowObj);
  return { data: inputData.data };
};
