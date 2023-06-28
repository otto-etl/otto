import { updateWorkflowNodes } from "../models/pgService.js";
import axios from "axios";

const sendAPI = async ({ method, url, data }) => {
  const response = await axios({ method, url, data });
  return response.data;
};

export const runAPI = async (workflowObj, nodeObj) => {
  const input = {
    url: nodeObj.data.url,
    method: nodeObj.data.httpVerb,
    data: nodeObj.jsonBody,
  };
  const data = await sendAPI(input);
  nodeObj.data.output = { data };
  await updateWorkflowNodes(workflowObj);
  return { data };
};
