import cron from "node-cron";
import { getTriggerNode } from "./node.js";
import {
  getWorkflow,
  activateWorkflow,
  deactivateWorkflow,
} from "../models/pgService.js";
const runningWorkFlows = {};

export const startCron = async (workflowID) => {
  const currentTime = Date.now();
  const workflowObj = await getWorkflow(workflowID);

  let { startTime, intervalInMinutes } = getTriggerNode(workflowObj).data;
  console.log("dbStartTime", startTime);
  startTime = "27 Jun 2023 18:23:00 CDT";
  startTime = Date.parse(startTime);

  console.log(
    "parsedStartTime",
    startTime,
    "currentTime",
    currentTime,
    "interval",
    intervalInMinutes,
    "timediff",
    startTime - currentTime
  );
  /* after the cron job function is called,
  the first cron job starts after the defined interval amount of time,
  therefore we subtract intervalInMinutes * 60000 from the start time
  */
  setTimeout(() => {
    const task = cron.schedule(`*/${intervalInMinutes} * * * *`, () => {
      console.log("running workflow", workflowID);
    });
    activateWorkflow(workflowID);
    runningWorkFlows[workflowID] = task;
  }, startTime - currentTime - intervalInMinutes * 60000);
};

export const stopCron = (workflowID) => {
  const task = runningWorkFlows[workflowID];
  if (task) {
    task.stop();
    runningWorkFlows[workflowID] = null;
  } else {
    throw new Error("no workflow to stop yet");
  }
  deactivateWorkflow(workflowID);
  console.log("running workflow", runningWorkFlows);
};
