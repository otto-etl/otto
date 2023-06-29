import axios from "axios";

const host = "http://localhost:3001/mock";

export const getWorkflowAPI = async (id) => {
  const res = await axios.get(`${host}/workflows/${id}`);
  return res.data;
};

export const postNodeChanges = async (payload) => {
  const res = await axios.post(`${host}/execute/node`, payload);
  return res.data;
};

export const saveWorkflow = async (id, payload) => {
  await axios.put(`${host}/workflows/${id}`, payload);
};

export const saveAndExecuteWorkflow = async (id, payload) => {
  const res = await axios.post(`${host}/execute/workflow/${id}`, payload);
  return res.data;
};
