import { getWorkflow } from "../models/pgService.js";
export const getTriggerNode = async (workflowId) => {
  const data = await getWorkflow(workflowId);
  return data.nodes.filter((node) => {
    return node.type === "trigger";
  })[0];
};

export const getNode = async (workflowId, nodeID) => {
  const data = await getWorkflow(workflowId);
  return data.nodes.filter((node) => {
    return node.id === nodeID;
  })[0];
};
