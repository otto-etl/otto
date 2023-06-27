import cron from "node-cron";
import { getTriggerNode } from "./node.js";
const runningWorkFlows = {};

export const startCron = async (workflowID) => {
  const currentTime = Date.now();
  const { data } = await getTriggerNode(workflowID);
  let { startTime, intervalInMinutes } = data;
  console.log("dbStartTime", startTime);
  startTime = "27 Jun 2023 13:58:00 CDT";
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
    runningWorkFlows[workflowID] = task;
  }, startTime - currentTime - intervalInMinutes * 60000);
};

export const stopCron = (workflowID) => {
  console.log(runningWorkFlows);
  const task = runningWorkFlows[workflowID];
  if (task) {
    task.stop();
    runningWorkFlows[workflowID] = null;
  } else {
    throw new Error("no workflow to stop yet");
  }
  console.log(runningWorkFlows);
};
