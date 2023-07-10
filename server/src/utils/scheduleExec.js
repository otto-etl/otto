import cron from "node-cron";
import { getScheduleNode } from "./node.js";
import {
  activateWorkflow,
  deactivateWorkflow,
  getActiveWorkflows,
  setStartTime,
} from "../models/pgService.js";
import { runWorkflow } from "./workflowExec.js";
import { throwWFErrorAndUpdateDB } from "./errors.js";
import { nodeInputvalidation } from "./nodeInput.js";
import { workflowInputvalidation } from "./workflowInput.js";
import { updateWorkflowError } from "../models/pgService.js";
// workflows that have cron job started
const startedWorkflows = {};
// workflows that have timeout triggered but cron job hasn't started
const pendingWorkflows = {};

// iife to restart cron at server restart
(async () => {
  try {
    const activeWorkflows = await getActiveWorkflows();
    activeWorkflows.forEach((workflowObj) => {
      console.log("server started, restarting active workflow", workflowObj.id);
      startCron(workflowObj);
    });
  } catch (e) {
    console.log("no active workflow in db");
  }
})();

export const startCron = async (workflowObj) => {
  const workflowID = workflowObj.id;
  const currentTimeInMilsec = Date.now();
  const scheduleNodeObj = getScheduleNode(workflowObj);
  await workflowInputvalidation(workflowObj);
  await nodeInputvalidation(workflowObj, scheduleNodeObj);

  if (!scheduleNodeObj) {
    const message = "No schedule node in the workflow, unable to start cron";
    await throwWFErrorAndUpdateDB(workflowObj, message);
  }

  const intervalInMinutes = scheduleNodeObj.data.intervalInMinutes;
  let startTime;

  //if workflow is already active, use start time in workflow start_time field ind the db
  if (workflowObj.active) {
    startTime = workflowObj.start_time;
  } else {
    //if workflow is not active, use start time from the schedule node
    startTime = scheduleNodeObj.data.startTime;
    await activateWorkflow(workflowID);
  }

  let startTimeInMilsec = Date.parse(startTime);
  //if server is down for long period of time and start time is less than current time,
  //calculate & reset the next start time
  if (startTimeInMilsec < currentTimeInMilsec) {
    startTimeInMilsec = nextStartTimeAfterCurrentTimeInMilSec(
      startTimeInMilsec,
      currentTimeInMilsec,
      intervalInMinutes
    );
    console.log("start time in the past new start time ", startTimeInMilsec);
    //update the db to reflect the next correct start time
    setStartTime(workflowID, new Date(startTimeInMilsec));
  }

  /* after the cron job function is triggered,
  the first cron job starts after the defined interval amount of time,
  therefore we subtract intervalInMinutes * 60000 from the start time to get the timeout delay*/
  const timeoutDelay =
    startTimeInMilsec - currentTimeInMilsec - intervalInMinutes * 60000;

  console.log(
    "timeout for cron triggered, first cron starting in",
    (startTimeInMilsec - currentTimeInMilsec) / 60000,
    " mins"
  );

  //use timeout to start cron after the timeout delay
  const timeoutID = setTimeout(() => {
    const task = cron.schedule(`*/${intervalInMinutes} * * * *`, () => {
      runWorkflow(workflowObj);
      const dbStartTime = nextStartTime(startTimeInMilsec, intervalInMinutes);
      //update the db to reflect the next correct start time
      setStartTime(workflowID, dbStartTime);
      console.log("next start time set by cron", dbStartTime);
    });
    startedWorkflows[workflowID] = task;
    pendingWorkflows[workflowID] = null;
  }, timeoutDelay);

  pendingWorkflows[workflowID] = timeoutID;
};

export const stopCron = async (workflowID) => {
  console.log("stopping cron for wf ", workflowID);
  const task = startedWorkflows[workflowID];
  const timeoutID = pendingWorkflows[workflowID];
  if (task) {
    task.stop();
    startedWorkflows[workflowID] = null;
  } else if (pendingWorkflows[workflowID]) {
    clearTimeout(timeoutID);
    pendingWorkflows[workflowID] = null;
  }
  await deactivateWorkflow(workflowID);
};

const nextStartTime = (startTimeinMilsec, intervalInMinutes) => {
  const date = new Date(startTimeinMilsec + intervalInMinutes * 60000);
  return date;
};

const nextStartTimeAfterCurrentTimeInMilSec = (
  startTimeinMilsec,
  currentTimeInMilsec,
  intervalInMinutes
) => {
  while (startTimeinMilsec < currentTimeInMilsec) {
    startTimeinMilsec += intervalInMinutes * 60000;
  }
  return startTimeinMilsec;
};
