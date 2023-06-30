import pgPromise from "pg-promise";
const pgp = pgPromise();

const db = pgp(
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/${process.env.DBNAME}`
);

export const getAllWorkflows = async () => {
  return await db.many("SELECT * FROM workflow");
};

export const getActiveWorkflowIDs = async () => {
  return await db.many("SELECT id FROM workflow WHERE active = true");
};

export const getWorkflow = async (id) => {
  return await db.one("SELECT * FROM workflow WHERE id = ${id}", { id });
};

export const updateNodes = async (workflowObj) => {
  return await db.any(
    "UPDATE workflow SET updated_at = NOW(), nodes=${nodes} WHERE id = ${workflowID}",
    {
      nodes: JSON.stringify(workflowObj.nodes),
      workflowID: workflowObj.id,
    }
  );
};

export const activateWorkflow = async (workflowID, startTime) => {
  return await db.any(
    "UPDATE workflow SET active=true, start_time=${startTime}, updated_at = NOW() WHERE id = ${workflowID}",
    {
      workflowID: workflowID,
      startTime: startTime,
    }
  );
};

export const deactivateWorkflow = async (workflowID) => {
  return await db.any(
    "UPDATE workflow SET active=false, start_time = NULL, updated_at = NOW() WHERE id = ${workflowID}",
    {
      workflowID: workflowID,
    }
  );
};

export const updateNodesEdges = async ({ workflowID, nodes, edges }) => {
  return await db.any(
    "UPDATE workflow SET nodes = ${nodes}, edges = ${edges}, updated_at = NOW() WHERE id = ${workflowID}",
    {
      workflowID: workflowID,
      nodes: nodes,
      edges: edges,
    }
  );
};

export const setStartTime = async (workflowID, startTime) => {
  return await db.any(
    "UPDATE workflow SET start_time = ${startTime} WHERE id = ${workflowID}",
    {
      workflowID: workflowID,
      startTime: startTime,
    }
  );
};
