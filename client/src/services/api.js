import axios from "axios";
const host =
  process.env.NODE_ENV === "PRODUCTION"
    ? process.env.REACT_APP_PRODUCTION_URL
    : process.env.REACT_APP_DEVELOPMENT_URL;
console.log(host);
export const getWorkflowAPI = async (id) => {
  const res = await axios.get(`${host}/workflows/${id}`);
  return res.data;
};

export const getAllWorkflows = async () => {
  const res = await axios.get(`${host}/workflows`);
  return res.data;
};

export const saveAndExecuteNode = async (payload) => {
  let workflowDataWithError;
  const res = await axios.post(`${host}/execute/node`, payload).catch((e) => {
    if (
      e.response.data.errName === "ExternalError" ||
      e.response.data.errName === "NodeError"
    ) {
      workflowDataWithError = {};
      workflowDataWithError["nodes"] = e.response.data.body.nodes;
      workflowDataWithError["edges"] = e.response.data.body.edges;
      workflowDataWithError["errName"] = e.response.data.errName;
      workflowDataWithError["errMessage"] = e.response.data.errMessage;
    }
  });
  return workflowDataWithError ? workflowDataWithError : res.data;
  // let workflowDataWithError;
  // const res = await axios.post(`${host}/execute/node`, payload).catch((e) => {
  //   workflowDataWithError = e.response.data.body;
  //   const errName = e.response.data.errName;
  //   if (errName !== "WorkflowError") {
  //     let errorNode = workflowDataWithError.nodes.find(
  //       (node) => node.id === payload.nodeID
  //     );
  //     workflowDataWithError = errorNode;
  //   } else {
  //     // Send to WorkflowLayout, store in state, render message
  //   }
  // });
  // return workflowDataWithError ? workflowDataWithError : res.data;
};

export const saveWorkflow = async (id, payload) => {
  await axios.put(`${host}/workflows/${id}`, payload);
};

export const saveAndExecuteWorkflow = async (id, payload) => {
  let workflowDataWithError;
  const res = await axios
    .post(`${host}/execute/workflow/${id}`, payload)
    .catch((e) => {
      workflowDataWithError = {};
      workflowDataWithError["nodes"] = e.response.data.body.nodes;
      workflowDataWithError["edges"] = e.response.data.body.edges;
      workflowDataWithError["errName"] = e.response.data.errName;
      workflowDataWithError["errMessage"] = e.response.data.errMessage;
    });

  return workflowDataWithError ? workflowDataWithError : res.data;
};

export const toggleWorkflowStatus = async (id, active) => {
  let res;
  if (active) {
    res = await axios.put(`${host}/execute/workflow/${id}`);
  } else {
    res = await axios.put(`${host}/execute/stopworkflow/${id}`);
  }
  return res.status;
};

export const createNewWF = async (payload) => {
  const res = await axios.post(`${host}/workflows`, payload);
  return res.data;
};

export const getExecutions = async (workflowID) => {
  const res = await axios.get(`${host}/executions/${workflowID}`);
  return res.data;
};
