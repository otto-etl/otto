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
    console.log("oAuthAndSned result", data);
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

const getAccessToken = async (
  nodeObj,
  accessTokenURL,
  clientID,
  clientSecret,
  scope
) => {
  const headers = {
    Authorization:
      "Basic " +
      new Buffer.from(clientID + ":" + clientSecret).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const data = { grant_type: "client_credentials", scope: scope };
  const response = await axios({
    method: "POST",
    url: accessTokenURL,
    data,
    headers,
  });
  nodeObj.data["token"] = response.data;
};

const oAuthAndSend = async (nodeObj) => {
  let {
    httpVerb,
    url,
    header,
    jsonBody,
    accessTokenURL,
    clientID,
    clientSecret,
    scope,
    oAuthChecked,
  } = nodeObj.data;

  let data;

  //check if nodeObj.data has access token
  if (oAuthChecked) {
    if (!nodeObj.data.token) {
      await getAccessToken(
        nodeObj,
        accessTokenURL,
        clientID,
        clientSecret,
        scope
      );
    }
    header["Authorization"] = "Bearer " + nodeObj.data.token.access_token;
    if (Object.keys(jsonBody).length === 0) {
      data = undefined;
    } else {
      data = jsonBody;
    }
  }
  const res = await sendAPI({
    method: httpVerb,
    url,
    headers: header,
    data,
  });
  return res;
};
