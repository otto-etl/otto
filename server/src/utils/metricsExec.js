import { updateTotalExecutions, updateAverageTimeTaken, updateSuccessRate } from "../models/workflowsService.js";

export const updateMetrics = (workflowObj, endTime) => {
  const newTimeTaken = new Date(endTime).getTime() - new Date(workflowObj.startTime).getTime();
  updateAverageTimeTaken(workflowObj.id, newTimeTaken);
  updateSuccessRate(workflowObj.id, true);
  updateTotalExecutions(workflowObj.id);  
}
