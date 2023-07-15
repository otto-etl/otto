import { getNode } from "./node.js";
import { runAPI } from "./apiExec.js";
import { runJSCode } from "./jsCodeExec.js";
import { runPSQLCode } from "./psqlExec.js";
import {
  updateWorkflowError,
  updateNodes,
} from "../models/workflowsService.js";
import { InternalError, throwWFErrorAndUpdateDB } from "./errors.js";
import { workflowInputvalidation } from "./workflowInput.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";
import { insertNewExecution } from "../models/workflowsService.js";
import { executeNode } from "./nodeExec.js";
import { updateMetrics } from "./metricsExec.js";
import { getSSERes } from "../routes/executionRoutes.js";

let completedNodes = {};

// const executeNode = async (workflowObj, nodeObj) => {
//   if (completedNodes[nodeObj.id]) {
//     return;
//   } else {
//     if (nodeObj.type === "extract") {
//       await runAPI(workflowObj, nodeObj);
//     } else if (nodeObj.type === "transform") {
//       await runJSCode(workflowObj, nodeObj);
//     } else if (nodeObj.type === "load") {
//       await runPSQLCode(workflowObj, nodeObj);
//     } else if (nodeObj.type !== "schedule") {
//       const message = `Invalid Node Type: ${nodeObj.type}`;
//       await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
//     }
//     completedNodes[nodeObj.id] = true;
//   }
// };

const activateNode = async (workflowObj, nodeObj) => {
  nodeObj.data.output = {};
  const edges = workflowObj.edges.filter((edge) => edge.target === nodeObj.id);

  if (edges.length === 0 && nodeObj.type !== "schedule") {
    const message = `Unconnected nodes detected`;
    await throwWFErrorAndUpdateDB(workflowObj, message);
  }
  if (edges.length === 0) {
    return;
  } else {
    const nodes = edges.map((edge) => getNode(workflowObj, edge.source));
    const promises = nodes.map((node) => {
      return new Promise((res, rej) => {
        res(activateNode(workflowObj, node));
      });
    });
    await Promise.all(promises);

    if (completedNodes[nodeObj.id]) {
      return;
    } else {
      await executeNode(workflowObj, nodeObj);
    }
  }
};

export const runWorkflow = async (workflowObj) => {
  workflowObj.startTime = new Date(Date.now()).toISOString();

  await workflowInputvalidation(workflowObj);
  const finalLoadNodes = workflowObj.nodes.filter(
    (node) => node.type === "load"
  );

  // workflowObj.startTime = Date.now();
  console.log("Workflow start time:", workflowObj.startTime);
  const promises = finalLoadNodes.map((node) => {
    return new Promise((res, rej) => {
      res(activateNode(workflowObj, node));
    });
  });
  await Promise.all(promises);

  completedNodes = {};
  console.log("workflow completed", workflowObj.id);
  updateMetrics(workflowObj, new Date(Date.now()).toISOString());
  await updateWorkflowError(workflowObj.id, null);
  workflowObj.error = null;
  const newExecution = await insertNewExecution("TRUE", workflowObj);
  const SSERes = getSSERes();
  SSERes.write("data:" + JSON.stringify(newExecution));
  SSERes.write("\n\n");
};