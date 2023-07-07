import { updateNodes } from "../models/pgService.js";
import { throwNDErrorAndUpdateDB, throwEXErrorAndUpdateDB } from "./errors.js";

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
    const status = e.toJSON().status;
    const code = e.toJSON().code;
    if ((!status && code !== "ENOTFOUND") || status >= 500) {
      const message = `API call failed with error: ${e.message}`;
      await throwEXErrorAndUpdateDB(workflowObj, nodeObj, message);
    } else {
      const message = `API call failed with error: ${e.message}`;
      await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
    }
  }

  nodeObj.data.output = { data };
  nodeObj.data.error = null;
  await updateNodes(workflowObj);
  return { data };
};
