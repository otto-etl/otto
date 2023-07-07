import { getNode } from "./node.js";
import { runAPI } from "./apiExec.js";
import { runJSCode } from "./jsCodeExec.js";
import { runPSQLCode } from "./psqlExec.js";
import { InternalError } from "./errors.js";
import { updateWorkflowError, updateNodes } from "../models/pgService.js";
import { workflowInputvalidation } from "./workflowInput.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";

const executeNode = async (workflowObj, nodeObj) => {
  console.log("Executing node");
  console.log(nodeObj);
  if (nodeObj.type === "extract") {
    await runAPI(workflowObj, nodeObj);
  } else if (nodeObj.type === "transform") {
    await runJSCode(workflowObj, nodeObj);
  } else if (nodeObj.type === "load") {
    await runPSQLCode(workflowObj, nodeObj);
  } else if (nodeObj.type !== "trigger") {
    const message = `Invalid Node Type: ${nodeObj.type}`;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }
};

const activateNode = async (workflowObj, nodeObj) => {
  const edges = workflowObj.edges.filter((edge) => edge.target === nodeObj.id);

  if (edges.length === 0) {
    await executeNode(workflowObj, nodeObj);
  } else {
    const nodes = edges.map((edge) => getNode(workflowObj, edge.source));
    const promises = nodes.map((node) => {
      return new Promise((res, rej) => {
        res(activateNode(workflowObj, node));
      });
    });
    await Promise.all(promises);
    await executeNode(workflowObj, nodeObj);
  }
};

export const runWorkflow = async (workflowObj) => {
  console.log("running workflow", workflowObj.id);
  await workflowInputvalidation(workflowObj);
  const finalNodes = workflowObj.nodes.filter((node) => node.type === "load");

  for (const node of finalNodes) {
    await activateNode(workflowObj, node);
  }

  console.log("workflow completed", workflowObj.id);
  await updateWorkflowError(workflowObj.id, null);
};
