import { dataIsEmpty } from "./helper.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";
import { convertLabel } from "./helper.js";
import { getWorkflow } from "../models/workflowsService.js";
import { uploadFileToS3 } from "../models/s3service.js";
import { getFileFromS3 } from "../models/s3service.js";
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
    if (!sourceNode.data.output.uuid) {
      const message = `No input data from previous node: ${sourceNode.data.label} `;
      await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
    } else {
      const output = await getFileFromS3(workflowObj, sourceNode);
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

export const resetSubsequentOutputs = async (
  nodes,
  edges,
  nodeID,
  workflowObj
) => {
  const sourceEdges = edges.filter((edge) => {
    return edge.source === nodeID;
  });
  if (sourceEdges.length > 0) {
    sourceEdges.forEach((edge) => {
      resetSubsequentOutputs(nodes, edges, edge.target, workflowObj);
    });
  }
  const dbNode = getNode(workflowObj, nodeID);
  await uploadFileToS3(workflowObj, dbNode, "");
};

export const replaceFEOutputWithUUID = (fnNodes, workflowObj) => {
  for (const fnNodeObj of fnNodes) {
    const dbNode = getNode(workflowObj, fnNodeObj.id);
    if (dbNode.data && dbNode.data.output) {
      fnNodeObj["data"]["output"] = dbNode.data.output;
    }
  }
};
