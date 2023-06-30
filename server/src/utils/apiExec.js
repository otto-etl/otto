import { updateNodes } from "../models/pgService.js";
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
  let data;
  try {
    data = await sendAPI(input);
  } catch (e) {
    throw new Error(`API call failed with error ${e.message}`);
  }

  nodeObj.data.output = { data };
  await updateNodes(workflowObj);
  return { data };
};
