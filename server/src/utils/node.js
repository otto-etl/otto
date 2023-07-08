import { dataIsEmpty } from "./helper.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";
//takes a workflow object and return the schedule node
export const getScheduleNode = (workflowObj) => {
  return workflowObj.nodes.find((node) => node.type === "schedule");
};

//takes a workflow object and node id and return the node
export const getNode = (workflowObj, nodeID) => {
  return workflowObj.nodes.find((node) => node.id === nodeID);
};

export const getAllNodesInOrder = (workflowObj) => {
  const executionOrder = [];

  //get the extract node & push to executionOrder
  const extractNode = getExtractNode(workflowObj);
  executionOrder.push(extractNode);

  //set extractNode to be the sourceNode
  let sourceNodeObj = extractNode;
  while (true) {
    // break out when we have 1 node less than the total nodes because we are manually starting so schedule node is excluded
    if (executionOrder.length === workflowObj.nodes.length - 1) {
      break;
    }
    //find the target node of the source node and add to the execution order
    let targetNodeObj = getTargetNodeObj(workflowObj, sourceNodeObj);
    executionOrder.push(targetNodeObj);
    //reset the source node to the current target
    sourceNodeObj = targetNodeObj;
  }
  return executionOrder;
};

const getExtractNode = (workflowObj) => {
  return workflowObj.nodes.find((node) => node.type === "extract");
};

const getTargetNodeObj = (workflowObj, sourceNodeObj) => {
  const edgeObj = workflowObj.edges.find((edge) => {
    return edge.source === sourceNodeObj.id;
  });
  const targetID = edgeObj.target;
  return workflowObj.nodes.find((node) => node.id === targetID);
};

export const getInputData = async (workflowObj, nodeObj) => {
  const edges = workflowObj.edges;
  const currentNodeId = nodeObj.id;
  const sourceEdges = edges.filter((edge) => edge.target === currentNodeId);
  const data = [];
  for (const edge of sourceEdges) {
    const sourceNode = getNode(workflowObj, edge.source);
    if (dataIsEmpty(sourceNode.data.output)) {
      const message = `No input data from previous node: ${sourceNode.data.label} `;
      await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
    } else {
      data.push(JSON.parse(JSON.stringify(sourceNode.data.output)));
    }
  }
  return data;
};
