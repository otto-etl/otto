import vm from "vm";
import { updateNodes } from "../models/pgService.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";
import { getMultipleInputData } from "./node.js";

export const runJSCode = async (workflowObj, nodeObj) => {
  const customCode = nodeObj.data.jsCode;
  let inputData = await getMultipleInputData(workflowObj, nodeObj);
  //need to be modified when handling multiple inputs
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
  console.log(inputData.data);
  return { data: inputData.data };
};
