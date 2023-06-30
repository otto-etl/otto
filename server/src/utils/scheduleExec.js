import cron from "node-cron";
import { getTriggerNode } from "./node.js";
import {
  getWorkflow,
  activateWorkflow,
  deactivateWorkflow,
  getActiveWorkflowIDs,
  setStartTime,
} from "../models/pgService.js";
import { runWorkflow } from "./workflowExec.js";

// workflows that have cron job started
const startedWorkflows = {};
// workflows that have timeout triggered but cron job hasn't started
const pendingWorkflows = {};

//iife to restart cron at server restart
// (async () => {
//   const activeWorkflowIDs = await getActiveWorkflowIDs();
//   activeWorkflowIDs.forEach((idObj) => {
//     startCron(idObj.id);
//   });
// })();

export const startCron = async (workflowID) => {
  const currentTime = Date.now();
  const workflowObj = await getWorkflow(workflowID);
  const triggerNodeObj = await getTriggerNode(workflowObj);
  const intervalInMinutes = triggerNodeObj.data.intervalInMinutes;
  let startTime;

  if (workflowObj.active) {
    startTime = workflowObj.start_time;
    console.log(startTime);
  } else {
    startTime = triggerNodeObj.data.startTime;
  }

  //set workflow to active & start workflow start time to trigger node start time
  await activateWorkflow(workflowID);
  const startTimeInMilsec = Date.parse(startTime);

  /* after the cron job function is called,
  the first cron job starts after the defined interval amount of time,
  therefore we subtract intervalInMinutes * 60000 from the start time to get the timeout delay
  */
  const timeoutDelay =
    startTimeInMilsec - currentTime - intervalInMinutes * 60000;

  console.log(
    "timeout for cron triggered, first cron starting in",
    (startTimeInMilsec - currentTime) / 60000,
    " mins"
  );

  //use timeout to start cron
  const timeoutID = setTimeout(() => {
    const task = cron.schedule(`*/${intervalInMinutes} * * * *`, () => {
      runWorkflow(workflowObj);
      const dbStartTime = nextStartTime(startTimeInMilsec, intervalInMinutes);
      setStartTime(workflowID, dbStartTime);
      console.log("next start time set at", dbStartTime);
    });
    startedWorkflows[workflowID] = task;
    pendingWorkflows[workflowID] = null;
  }, timeoutDelay);

  pendingWorkflows[workflowID] = timeoutID;
};

export const stopCron = async (workflowID) => {
  const task = startedWorkflows[workflowID];
  const timeoutID = pendingWorkflows[workflowID];
  const workflowObj = await getWorkflow(workflowID);
  if (task) {
    task.stop();
    startedWorkflows[workflowID] = null;
  } else if (pendingWorkflows[workflowID]) {
    clearTimeout(timeoutID);
    pendingWorkflows[workflowID] = null;
  } else if (workflowObj.active === false) {
    throw new Error("workflow not active yet");
  }
  deactivateWorkflow(workflowID);
};

const nextStartTime = (startTimeinMilsec, intervalInMinutes) => {
  const date = new Date(startTimeinMilsec + intervalInMinutes * 60000);
  return date;
};
