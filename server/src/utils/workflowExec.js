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
const initialRetryIntervalInMilSec = 1000;

const activateNode = async (workflowObj, nodeObj) => {
  if (!completedNodes[nodeObj.id]) {
    nodeObj.data.output = {};
  }
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
      await completedNodes[nodeObj.id];
      return;
    } else {
      let nodeStartTime = new Date(Date.now()).toISOString();
      const nodeExecution = executeNode(workflowObj, nodeObj);
      completedNodes[nodeObj.id] = nodeExecution;
      await nodeExecution;
      if (workflowObj.active) {
        updateNodeMetrics(workflowObj, nodeObj, nodeStartTime);
      }
    }
  }
};

export const runWorkflow = async (workflowObj) => {
  completedNodes = {};
  let executionSuccess = "";
  workflowObj.startTime = new Date(Date.now()).toISOString();

  await workflowInputvalidation(workflowObj);
  const finalLoadNodes = workflowObj.nodes.filter(
    (node) => node.type === "load"
  );

  console.log(`workflow ${workflowObj.name} started`);
  const promises = finalLoadNodes.map((node) => {
    return new Promise((res, rej) => {
      res(activateNode(workflowObj, node));
    });
  });
  await Promise.all(promises);
  console.log(`workflow ${workflowObj.name} completed`);
  if (workflowObj.active) {
    updateMetrics(workflowObj, new Date(Date.now()).toISOString());
  }
  await updateWorkflowError(workflowObj.id, null);
  workflowObj.error = null;
  executionSuccess = "TRUE";

  const newExecution = await insertNewExecution(executionSuccess, workflowObj);
  const SSERes = getSSERes();
  SSERes.write("data:" + JSON.stringify(newExecution));
  SSERes.write("\n\n");
};

export const runWorkflowCron = async (workflowObj) => {
  completedNodes = {};
  let executionSuccess = "";
  const SSERes = getSSERes();
  try {
    workflowObj.startTime = new Date(Date.now()).toISOString();

    await workflowInputvalidation(workflowObj);
    const finalLoadNodes = workflowObj.nodes.filter(
      (node) => node.type === "load"
    );
    console.log(`workflow ${workflowObj.name} started`);
    const promises = finalLoadNodes.map((node) => {
      return new Promise((res, rej) => {
        res(activateNode(workflowObj, node));
      });
    });
    await Promise.all(promises);
    console.log(`workflow ${workflowObj.name} completed`);

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
    if (!retries[workflowObj.id]) {
      retries[workflowObj.id] = { times: 0, lap: initialRetryIntervalInMilSec };
    }

    if (retries[workflowObj.id].times === retryMax) {
      retries[workflowObj.id].times = 0;
      retries[workflowObj.id].lap = initialRetryIntervalInMilSec;
    } else if (
      e.name === "ExternalError" &&
      retries[workflowObj.id].times < retryMax
    ) {
      setTimeout(async () => {
        await runWorkflowCron(workflowObj);
      }, retries[workflowObj.id].lap);

      retries[workflowObj.id] = {
        times: retries[workflowObj.id].times + 1,
        lap: retries[workflowObj.id].lap * 10,
      };
    }
  }
};
