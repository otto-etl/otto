import axios from "axios";

const host = "http://localhost:3001";

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
  const res = await axios.post(`${host}/execute/node`, payload)
    .catch((e) => {
	  workflowDataWithError = e.response.data.body;
	  const errName = e.response.data.errName;
      if (errName !== "WorkflowError") {
		let errorNode = workflowDataWithError.nodes.find(node => node.id === payload.nodeID);
	    workflowDataWithError = errorNode;
	  }
	  else {
	    // Send to WorkflowLayout, store in state, render message	  
	  }
    });
  return workflowDataWithError ? workflowDataWithError : res.data;
};

export const saveWorkflow = async (id, payload) => {
  await axios.put(`${host}/workflows/${id}`, payload);
};

export const saveAndExecuteWorkflow = async (id, payload) => {
  const res = await axios.post(`${host}/execute/workflow/${id}`, payload);
  return res.data;
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
