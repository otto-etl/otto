import { throwNDErrorAndUpdateDB } from "./errors.js";
// all node needs to have a data field
// no need to check data inside data field because other error handles handles it

export const nodeInputvalidation = async (workflowObj, nodeObj) => {
  await dataNonEmptyCheck(workflowObj, nodeObj);
  await lableUniqueCheck(workflowObj, nodeObj);
  await apiNodeCheck(workflowObj, nodeObj);
};

//just need to make sure data property is not null and is an object
const dataNonEmptyCheck = async (workflowObj, nodeObj) => {
  if (
    typeof nodeObj.data !== "object" ||
    Array.isArray(nodeObj.data) ||
    nodeObj.data === null
  ) {
    nodeObj.data = {};
    const message = "Node missing data field";
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }
};

const lableUniqueCheck = async (workflowObj, nodeObj) => {
  let nodeLabel = nodeObj.data.label;
  let message;
  if (typeof nodeLabel !== "string" || !/^[a-zA-Z](\w|\s)+$/.test(nodeLabel)) {
    message =
      "Node name has to be a unique non empty alphanumeric string that starts with alphabets";
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }
  const labels = workflowObj.nodes.map((node) => node.data.label);
  if (labels.filter((label) => label === nodeLabel).length > 1) {
    message = "This node's name already exists, please choose a different name";
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }
};

const apiNodeCheck = async (workflowObj, nodeObj) => {
  try {
    if (nodeObj.data.headerChecked) {
      nodeObj.data.header = JSON.parse(nodeObj.data.header);
    } else {
      nodeObj.data.header = null;
    }
    if (nodeObj.data.bodyChecked) {
      nodeObj.data.jsonBody = JSON.parse(nodeObj.data.jsonBody);
    } else {
      nodeObj.data.jsonBody = null;
    }
  } catch (e) {
    const message = `Unable to parse body/header JSON :${e.message}`;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }
};
