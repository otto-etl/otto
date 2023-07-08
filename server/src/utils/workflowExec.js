import { getNode } from "./node.js";
import { runAPI } from "./apiExec.js";
import { runJSCode } from "./jsCodeExec.js";
import { runPSQLCode } from "./psqlExec.js";
import { InternalError } from "./errors.js";
import { updateWorkflowError, updateNodes } from "../models/pgService.js";
import { workflowInputvalidation } from "./workflowInput.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";

let completedNodes = {};

const executeNode = async (workflowObj, nodeObj) => {
  if (completedNodes[nodeObj.id]) {
    return;
  } else {
    if (nodeObj.type === "extract") {
      await runAPI(workflowObj, nodeObj);
    } else if (nodeObj.type === "transform") {
      await runJSCode(workflowObj, nodeObj);
    } else if (nodeObj.type === "load") {
      await runPSQLCode(workflowObj, nodeObj);
    } else if (nodeObj.type !== "schedule") {
      const message = `Invalid Node Type: ${nodeObj.type}`;
      await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
    }
    completedNodes[nodeObj.id] = true;
  }
};

const activateNode = async (workflowObj, nodeObj) => {
  const edges = workflowObj.edges.filter((edge) => edge.target === nodeObj.id);

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
    await executeNode(workflowObj, nodeObj);
  }
};

export const runWorkflow = async (workflowObj) => {
  console.log("running workflow", workflowObj.id);
  await workflowInputvalidation(workflowObj);
  const finalLoadNodes = workflowObj.nodes.filter(
    (node) => node.type === "load"
  );

  const promises = finalLoadNodes.map((node) => {
    return new Promise((res, rej) => {
      res(activateNode(workflowObj, node));
    });
  });
  await Promise.all(promises);

  // for (const node of finalLoadNodes) {
  //   await activateNode(workflowObj, node);
  // }

  completedNodes = {};
  console.log("workflow completed", workflowObj.id);
  await updateWorkflowError(workflowObj.id, null);
};
