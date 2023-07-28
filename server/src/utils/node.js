import { dataIsEmpty } from "./helper.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";
import { convertLabel } from "./helper.js";
//takes a workflow object and return the schedule node
export const getScheduleNode = (workflowObj) => {
  return workflowObj.nodes.find((node) => node.type === "schedule");
};

//takes a workflow object and node id and return the node
export const getNode = (workflowObj, nodeID) => {
  return workflowObj.nodes.find((node) => node.id === nodeID);
};

export const getNodeByID = (workflowObj, id) => {
  return workflowObj.nodes.find((node) => node.id === id);
};

export const getMultipleInputData = async (workflowObj, nodeObj) => {
  const edges = workflowObj.edges;
  const currentNodeId = nodeObj.id;
  const sourceEdges = edges.filter((edge) => edge.target === currentNodeId);
  const data = {};

  for (const edge of sourceEdges) {
    const sourceNode = getNode(workflowObj, edge.source);
    if (dataIsEmpty(sourceNode.data.output.data)) {
      const message = `No input data from previous node: ${sourceNode.data.label} `;
      await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
    } else {
      const output = JSON.parse(JSON.stringify(sourceNode.data.output.data));
      data[convertLabel(sourceNode.data.label)] = output;
    }
  }
  return { data };
};

export const getInputData = async (workflowObj, nodeObj) => {
  const edges = workflowObj.edges;
  const currentNodeId = nodeObj.id;
  const sourceEdge = edges.find((edge) => edge.target === currentNodeId);
  const sourceNode = getNode(workflowObj, sourceEdge.source);
  if (dataIsEmpty(sourceNode.data.output.data)) {
    const message = `No input data from previous node: ${sourceNode.data.label} `;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  } else {
    return sourceNode.data.output;
  }
};

export const resetSubsequentOutputs = (nodes, edges, nodeID) => {
  const sourceEdges = edges.filter((edge) => {
    return edge.source === nodeID;
  });
  if (sourceEdges.length > 0) {
    sourceEdges.forEach((edge) => {
      resetSubsequentOutputs(nodes, edges, edge.target);
    });
  }
  const node = getNode({ nodes }, nodeID);
  node.data.output = {};
};
