import axios from "axios";
import { throwNDErrorAndUpdateDB, throwEXErrorAndUpdateDB } from "./errors.js";

export const isValidArray = (input) => {
  return Array.isArray(input) && input.length !== 0;
};

export const dataIsEmpty = (data) => {
  return (
    !data ||
    Object.keys(data).length === 0 ||
    (Array.isArray(data) && data.length === 0)
  );
};

export const validNodeTypes = (nodes) => {
  const validNodeTypes = ["schedule", "transform", "extract", "load"];
  for (const node of nodes) {
    if (!validNodeTypes.includes(node.type)) {
      return false;
    }
  }
  return true;
};

export const convertLabel = (label) => {
  const words = label.trim().toLowerCase().split(" ");
  return words
    .map((word, idx) => {
      if (idx !== 0) {
        return word[0].toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join("");
};

export const sendAPI = async ({
  method,
  url,
  data,
  headers,
  nodeObj,
  workflowObj,
}) => {
  try {
    console.log("calling", url, headers);
    const response = await axios({ method, url, data, headers });

    return response.data;
  } catch (e) {
    await processAxiosError(e, workflowObj, nodeObj);
  }
};

const processAxiosError = async (e, workflowObj, nodeObj) => {
  const status = e.response ? e.response.status : undefined;
  const code = e.code;
  if (
    (!status && code !== "ENOTFOUND" && code !== "ECONNREFUSED") ||
    status >= 500
  ) {
    const message = `API call failed with error: ${e.message}`;
    await throwEXErrorAndUpdateDB(workflowObj, nodeObj, message);
  } else {
    let errorDesc;
    switch (
      code // TODO: Determine errno codes that users are most likely to receive
    ) {
      case "ENOTFOUND":
        errorDesc = "DNS lookup failed.";
        break;
      case "ECONNREFUSED":
        errorDesc =
          "No connection could be made because the target machine actively refused it.";
        break;
      default:
        errorDesc = "See error code details.";
        break;
    }
    const message = `API call failed: ${errorDesc}\n\n(Error code: ${e.message})`;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }
};
