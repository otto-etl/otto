import { updateTotalExecutions, 
         updateAverageTimeTaken, 
		 updateSuccessRate, 
		 updateAverageNodeTimeTaken, 
		 updateAverageNodeData,
       } from "../models/workflowsService.js";

export const updateMetrics = (workflowObj, endTime) => {
  const newTimeTaken = new Date(endTime).getTime() - new Date(workflowObj.startTime).getTime();
  updateAverageTimeTaken(workflowObj.id, newTimeTaken);
  updateSuccessRate(workflowObj.id, true);
  updateTotalExecutions(workflowObj.id);  
}

export const updateNodeMetrics = (workflowObj, nodeObj, startTime) => {
  const nodeTimeTaken = new Date(Date.now()).getTime() - new Date(startTime).getTime();
  updateAverageNodeTimeTaken(workflowObj.id, nodeObj.id, nodeObj.data.label, nodeObj.type, nodeTimeTaken);
  updateAverageNodeData(workflowObj.id, nodeObj.id, nodeObj.data.label, nodeObj.type, nodeObj.data);
}