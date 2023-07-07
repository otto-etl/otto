import { getAllNodesInOrder, getTriggerNode } from "./node.js";
import { runAPI } from "./apiExec.js";
import { runJSCode } from "./jsCodeExec.js";
import { runPSQLCode } from "./psqlExec.js";
import { InternalError } from "./errors.js";
import { updateWorkflowError, updateNodes } from "../models/pgService.js";
import { workflowInputvalidation } from "./workflowInput.js";

export const runWorkflow = async (workflowObj) => {
  console.log("running workflow", workflowObj.id);
  await workflowInputvalidation(workflowObj);

  const nodesToExecute = getAllNodesInOrder(workflowObj);

  for (const nodeObj of nodesToExecute) {
    if (nodeObj.type === "extract") {
      await runAPI(workflowObj, nodeObj);
    } else if (nodeObj.type === "transform") {
      await runJSCode(workflowObj, nodeObj);
    } else if (nodeObj.type === "load") {
      await runPSQLCode(workflowObj, nodeObj);
    } else if (nodeObj.type !== "trigger") {
      const message = `Invalid Node Type: ${nodeObj.type}`;
      nodeObj.data.error = { name: "InternalError", message: message };
      await updateNodes(workflowObj);
      throw new InternalError(message, workflowObj);
    }
  }
  console.log("workflow completed", workflowObj.id);
  await updateWorkflowError(workflowObj.id, null);
};
