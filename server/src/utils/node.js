//takes a workflow object and return the trigger node
export const getTriggerNode = (workflowObj) => {
  return workflowObj.nodes.find((node) => node.type === "trigger");
};

//takes a workflow object and node id and return the node
export const getNode = (workflowObj, nodeID) => {
  return workflowObj.nodes.find((node) => node.id === nodeID);
};
