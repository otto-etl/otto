import { updateNodes } from "../models/workflowsService.js";
import { throwNDErrorAndUpdateDB, throwEXErrorAndUpdateDB } from "./errors.js";
import { nodeInputvalidation } from "./nodeInput.js";
import axios from "axios";

export const runAPI = async (workflowObj, nodeObj) => {
  await nodeInputvalidation(workflowObj, nodeObj);
  let data;
  if (!nodeObj.data.oAuthChecked) {
    data = await sendAPIWithoutOAuth(workflowObj, nodeObj);
  } else {
    data = await sendAPIWithOAuth(nodeObj, workflowObj);
  }
  nodeObj.data.output = { data };
  nodeObj.data.error = null;
  await updateNodes(workflowObj);
  return { data };
};

const getAccessToken = async (nodeObj, workflowObj) => {
  try {
    const { accessTokenURL, clientID, clientSecret, scope } = nodeObj.data;
    const headers = {
      Authorization:
        "Basic " +
        new Buffer.from(clientID + ":" + clientSecret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const data = { grant_type: "client_credentials", scope: scope };
    console.log("getting token", accessTokenURL, headers);
    const response = await sendAPI({
      method: "POST",
      url: accessTokenURL,
      data,
      headers,
      workflowObj,
      nodeObj,
    });
    nodeObj.data["token"] = response;
  } catch (e) {
    const message =
      "failed to get access token, please ckech client id and client secret";
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }
};

const sendAPIWithOAuth = async (nodeObj, workflowObj) => {
  let { httpVerb, url, header, jsonBody } = nodeObj.data;
  let headerToSend;

  //get access token for the first time if there is no token property
  if (!nodeObj.data.token) {
    await getAccessToken(nodeObj, workflowObj);
    headerToSend = setHeader(header, nodeObj);
  }
  let data;
  try {
    data = await sendAPI({
      method: httpVerb,
      url,
      headers: headerToSend,
      data: jsonBody,
      nodeObj,
      workflowObj,
    });
  } catch (e) {
    // if api call failed re-get access token and reset headers and then send
    console.log("get token again");
    await getAccessToken(nodeObj, workflowObj);
    headerToSend = setHeader(header, nodeObj);
    data = await sendAPI({
      method: httpVerb,
      url,
      headers: headerToSend,
      data: jsonBody,
      nodeObj,
      workflowObj,
    });
  }
  return data;
};

const sendAPIWithoutOAuth = async (workflowObj, nodeObj) => {
  let { httpVerb, url, header, jsonBody } = nodeObj.data;
  return await sendAPI({
    method: httpVerb,
    url,
    headers: header,
    data: jsonBody,
    nodeObj,
    workflowObj,
  });
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

const sendAPI = async ({
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

const setHeader = (header, nodeObj) => {
  if (!header) {
    header = {};
  }
  return {
    ...header,
    Authorization: "Bearer " + nodeObj.data.token.access_token,
  };
};
