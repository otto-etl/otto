import { getNode } from "./node.js";
import { updateWorkflowError } from "../models/workflowsService.js";
import { throwWFErrorAndUpdateDB } from "./errors.js";
import { workflowInputvalidation } from "./workflowInput.js";
import { insertNewExecution } from "../models/workflowsService.js";
import { executeNode } from "./nodeExec.js";
import { updateMetrics, updateNodeMetrics } from "./metricsExec.js";
import { getSSERes } from "../routes/executionRoutes.js";

let completedNodes = {};
let retries = {};
const retryMax = 3;

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
      let nodeStartTime = new Date(Date.now()).toISOString();
      await executeNode(workflowObj, nodeObj);
      if (workflowObj.active) {
        updateNodeMetrics(workflowObj, nodeObj, nodeStartTime);
      }
    }
  }
};

export const runWorkflow = async (workflowObj) => {
  let executionSuccess = "";
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
  await updateWorkflowError(workflowObj.id, null);
  workflowObj.error = null;
  executionSuccess = "TRUE";

  const newExecution = await insertNewExecution(executionSuccess, workflowObj);
  const SSERes = getSSERes();
  SSERes.write("data:" + JSON.stringify(newExecution));
  SSERes.write("\n\n");
};

export const runWorkflowCron = async (workflowObj) => {
  let executionSuccess = "";
  const SSERes = getSSERes();
  try {
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
    if (workflowObj.active) {
      updateMetrics(workflowObj, new Date(Date.now()).toISOString());
    }
    await updateWorkflowError(workflowObj.id, null);
    workflowObj.error = null;
    executionSuccess = "TRUE";
    const newExecution = await insertNewExecution(
      executionSuccess,
      workflowObj
    );
    SSERes.write("data:" + JSON.stringify(newExecution));
    SSERes.write("\n\n");
  } catch (e) {
    //when error implement retry
    executionSuccess = "FALSE";
    const newExecution = await insertNewExecution(
      executionSuccess,
      workflowObj
    );
    SSERes.write("data:" + JSON.stringify(newExecution));
    SSERes.write("\n\n");
    if (retries[workflowObj.id] >= 0) {
      retries[workflowObj.id] = retries[workflowObj.id] + 1;
    } else {
      retries[workflowObj.id] = 0;
    }

    if (retries[workflowObj.id] === retryMax) {
      retries[workflowObj.id] = 0;
    } else if (e.name === "NodeError" && retries[workflowObj.id] <= retryMax) {
      console.log(`retrying ${retries[workflowObj.id]}`);
      await runWorkflowCron(workflowObj);
    }
  }
};
