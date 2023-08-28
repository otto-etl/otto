import vm from "vm";
import { updateNodes } from "../models/workflowsService.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";
import { getMultipleInputData } from "./node.js";
import { nodeInputvalidation } from "./nodeInput.js";
import { uploadFileToS3 } from "../models/s3service.js";
export const runJSCode = async (workflowObj, nodeObj) => {
  await nodeInputvalidation(workflowObj, nodeObj);

  const customCode = nodeObj.data.jsCode;
  //this function also throws NodeError if any previous node is missing input data
  let inputData = await getMultipleInputData(workflowObj, nodeObj);

  try {
    vm.createContext(inputData);
    vm.runInContext(customCode, inputData);
  } catch (e) {
    const message = `JS code execution failed with error ${e.message}`;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }

  const uuid = await uploadFileToS3(workflowObj, nodeObj, inputData);
  nodeObj.data.output = { uuid };
  nodeObj.data.error = null;

  await updateNodes(workflowObj);
};
