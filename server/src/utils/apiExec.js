import { updateNodes } from "../models/workflowsService.js";
import { throwNDErrorAndUpdateDB, throwEXErrorAndUpdateDB } from "./errors.js";
import { nodeInputvalidation } from "./nodeInput.js";
import axios from "axios";

export const runAPI = async (workflowObj, nodeObj) => {
  await nodeInputvalidation(workflowObj, nodeObj);
  let data;
  try {
    //change to oAuthAndSend
    data = await oAuthAndSend(nodeObj);
  } catch (e) {
    const status = e.toJSON().status;
    const code = e.toJSON().code;
    if ((!status && code !== "ENOTFOUND") || status >= 500) {
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

const sendAPI = async ({ method, url, data, headers }) => {
  const response = await axios({ method, url, data, headers });
  return response.data;
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
    const response = await sendAPI({
      method: "POST",
      url: accessTokenURL,
      data,
      headers,
    });
    nodeObj.data["token"] = response;
  } catch (e) {
    const message =
      "failed to get access token, please check client id and client secret";
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }
};

const oAuthAndSend = async (nodeObj) => {
  let { httpVerb, url, header, jsonBody, oAuthChecked } = nodeObj.data;
  let dataToSend;
  let headerToSend;

  //set header to include oAuth token if OAuth is checked
  //get access token for the first time if there is no token property
  if (oAuthChecked && !nodeObj.data.token) {
    await getAccessToken(nodeObj);
    //copy header object and add authorization token
    headerToSend = setHeader(header, nodeObj);
  }

  //set data to jsonbody if jsonbody exists
  if (Object.keys(jsonBody).length === 0) {
    dataToSend = undefined;
  } else {
    dataToSend = jsonBody;
  }

  let res;
  try {
    res = await sendAPI({
      method: httpVerb,
      url,
      headers: headerToSend,
      data: dataToSend,
    });
  } catch (e) {
    // if api call failed re-get access token and reset headers and then send
    await getAccessToken(nodeObj);
    headerToSend = setHeader(header, nodeObj);
    res = await sendAPI({
      method: httpVerb,
      url,
      headers: headerToSend,
      data: dataToSend,
    });
  }
  return res;
};

const setHeader = (header, nodeObj) => {
  return {
    ...header,
    Authorization: "Bearer " + nodeObj.data.token.access_token,
  };
};
