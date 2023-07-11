import { updateNodes } from "../models/workflowsService.js";
import { throwNDErrorAndUpdateDB, throwEXErrorAndUpdateDB } from "./errors.js";
import { nodeInputvalidation } from "./nodeInput.js";
import axios from "axios";
import oauth from "axios-oauth-client";

export const runAPI = async (workflowObj, nodeObj) => {
  await nodeInputvalidation(workflowObj, nodeObj);
  const input = {
    url: nodeObj.data.url,
    method: nodeObj.data.httpVerb,
    data: nodeObj.data.bodyChecked ? nodeObj.data.jsonBody : {},
    headers: nodeObj.data.headerChecked ? nodeObj.data.header : {},
  };
  const oAuth = {
    oAuthChecked: nodeObj.data.oAuthChecked,
    accessTokenURL: nodeObj.data.accessTokenURL,
    clientID: nodeObj.data.clientID,
    clientSecret: nodeObj.data.clientSecret,
    scope: nodeObj.data.scope,
  };
  console.log(input);
  console.log(oAuth);
  let data;

  try {
    //change to oAuthAndSend
    data = await sendAPI(input);
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
  console.log({ method, url, data, headers });
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
  const getClientCredentials = oauth.clientCredentials(
    axios.create(),
    accessTokenURL,
    clientID,
    clientSecret
  );
  const auth = await getClientCredentials(scope);
  // auth {access_token = ...., refresh_token =..., expires =....}
  nodeObj.data.token = auth;
};

const refreshToken = () => {
  //if there is a refresh token, use the refreshToken to get new access token
  //otherwise call the get AccessToken function
};

const oAuthAndSend = (nodeObj, input, oAuth) => {
  const { method, url, data, headers } = input;
  const { accessTokenURL, clientID, clientSecret, scope, oAuthChecked } = oAuth;
  //check if nodeObj.data has access token
  if (oAuthChecked) {
    if (nodeObj.data.token) {
      getAccessToken(nodeObj, accessTokenURL, clientID, clientSecret, scope);
    }
    headers["authorization"] = `bearer ${nodeObj.auth.access_token}`;
  }

  sendAPI({ method, url, data, headers });
  //yes: add to the headers and then sendAPI
  //no: call getAccessToken and then add token to headers and send API
  //catch error that says token expires, call refresh token, then add token to headers and send API
};
