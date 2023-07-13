import { runAPI } from "./apiExec.js";
import { runJSCode } from "./jsCodeExec.js";
import { runPSQLCode } from "./psqlExec.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";

export const executeNode = async (workflowObj, nodeObj) => {
  if (nodeObj.type === "extractApi") {
    await runAPI(workflowObj, nodeObj);
  } else if (nodeObj.type === "extractPsql") {
    await runPSQLCode(workflowObj, nodeObj);
  } else if (nodeObj.type === "transform") {
    await runJSCode(workflowObj, nodeObj);
  } else if (nodeObj.type === "load") {
    await runPSQLCode(workflowObj, nodeObj);
  } else if (nodeObj.type !== "schedule") {
    const message = `Invalid Node Type: ${nodeObj.type}`;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }
};
