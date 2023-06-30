import cron from "node-cron";
import { getTriggerNode } from "./node.js";
import {
  getWorkflow,
  activateWorkflow,
  deactivateWorkflow,
} from "../models/pgService.js";
import { runWorkflow } from "./workflowExec.js";

const startedWorkflows = {};
const pendingWorkflows = {};

export const startCron = async (workflowID) => {
  if (pendingWorkflows[workflowID]) {
    throw new Error("workflow already pending");
  }
  if (startedWorkflows[workflowID]) {
    throw new Error("workflow already running");
  }

  const currentTime = Date.now();
  const workflowObj = await getWorkflow(workflowID);
  let { startTime, intervalInMinutes } = getTriggerNode(workflowObj).data;
  startTime = Date.parse(startTime);

  console.log(
    "cron job triggered starting in",
    (startTime - currentTime) / 60000,
    " mins"
  );
  /* after the cron job function is called,
  the first cron job starts after the defined interval amount of time,
  therefore we subtract intervalInMinutes * 60000 from the start time
  */
  const timeoutID = setTimeout(() => {
    const task = cron.schedule(`*/${intervalInMinutes} * * * *`, () => {
      runWorkflow(workflowObj);
    });
    activateWorkflow(workflowID);
    startedWorkflows[workflowID] = task;
    pendingWorkflows[workflowID] = null;
  }, startTime - currentTime - intervalInMinutes * 60000);
  pendingWorkflows[workflowID] = timeoutID;
};

export const stopCron = (workflowID) => {
  const task = startedWorkflows[workflowID];
  const timeoutID = pendingWorkflows[workflowID];
  if (task) {
    task.stop();
    startedWorkflows[workflowID] = null;
  } else if (pendingWorkflows[workflowID]) {
    clearTimeout(timeoutID);
    pendingWorkflows[workflowID] = null;
  } else {
    throw new Error("no workflow to stop yet");
  }
  deactivateWorkflow(workflowID);
};
