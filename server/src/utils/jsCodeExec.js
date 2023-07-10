import vm from "vm";
import { updateNodes } from "../models/workflowsService.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";
import { getInputData } from "./node.js";

export const runJSCode = async (workflowObj, nodeObj) => {
  const customCode = nodeObj.data.jsCode;
  let inputData = await getInputData(workflowObj, nodeObj);
  //need to be modified when handling multiple inputs
  inputData = inputData[0];

  try {
    vm.createContext(inputData);
    vm.runInContext(customCode, inputData);
  } catch (e) {
    const message = `JS code execution failed with error ${e.message}`;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }

  nodeObj.data.output = inputData;
  nodeObj.data.error = null;
  await updateNodes(workflowObj);
  return inputData;
};
