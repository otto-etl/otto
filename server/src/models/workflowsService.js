import pgPromise from "pg-promise";
import { encrypt, decrypt } from "../utils/encrypt.js";
const pgp = pgPromise();

const db = pgp(
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/${process.env.WORKFLOW_DBNAME}`
);

try {
  const connection = await db.connect();
  console.log("workflow db connection success");
  connection.done();
} catch (e) {
  throw new Error(`Unable to connect to workflow db with error ${e.message}`);
}

export const getAllWorkflows = async () => {
  const workflowObjs = await db.any("SELECT * FROM workflow");
  return workflowObjs.map((workflowObj) => {
    return { ...workflowObj, nodes: JSON.parse(decrypt(workflowObj.nodes)) };
  });
};

export const getActiveWorkflows = async () => {
  const activeWorkflowObjs = await db.many(
    "SELECT * FROM workflow WHERE active = true"
  );
  return activeWorkflowObjs.map((workflowObj) => {
    return { ...workflowObj, nodes: JSON.parse(decrypt(workflowObj.nodes)) };
  });
};

export const getWorkflow = async (id) => {
  const workflowObj = await db.one("SELECT * FROM workflow WHERE id = ${id}", {
    id,
  });

  return { ...workflowObj, nodes: JSON.parse(decrypt(workflowObj.nodes)) };
};

export const updateNodes = async (workflowObj) => {
  return await db.any(
    "UPDATE workflow SET updated_at = NOW(), nodes=${nodes} WHERE id = ${workflowID}",
    {
      nodes: encrypt(JSON.stringify(workflowObj.nodes)),
      workflowID: workflowObj.id,
    }
  );
};

export const activateWorkflow = async (workflowID) => {
  console.log(workflowID, "activated");
  return await db.any(
    "UPDATE workflow SET active=true, updated_at = NOW() WHERE id = ${workflowID}",
    {
      workflowID: workflowID,
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
      nodes: encrypt(nodes),
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

export const insertNewWF = async (name, nodes, edges) => {
  const newWorkflowObj = await db.one(
    "INSERT INTO workflow (name, nodes, edges, created_at, updated_at, active) VALUES " +
      "(${name}, ${nodes}, ${edges}, NOW(), NOW(), false) RETURNING *",
    {
      name: name,
      nodes: encrypt(nodes),
      edges: edges,
    }
  );
  return {
    ...newWorkflowObj,
    nodes: JSON.parse(decrypt(newWorkflowObj.nodes)),
  };
};

export const updateWorkflowError = async (workflowID, error) => {
  return await db.any(
    "UPDATE workflow SET error = ${error} WHERE id = ${workflowID}",
    {
      error: error,
      workflowID: workflowID,
    }
  );
};

export const insertNewExecution = async (successful, workflowObj) => {
  const encryptedWorkflow = {
    ...workflowObj,
    nodes: encrypt(JSON.stringify(workflowObj.nodes)),
  };
  const newExecution = await db.one(
    "INSERT INTO execution (start_time, end_time, successful, workflow_id, current_version, workflow) VALUES " +
      "(${start_time}, NOW(), ${successful}, ${workflow_id}, TRUE, ${workflowObj}) RETURNING *",
    {
      start_time: workflowObj.startTime,
      successful: successful,
      workflow_id: workflowObj.id,
      workflowObj: JSON.stringify(encryptedWorkflow),
    }
  );
  const newWorkflowObj = newExecution.workflow;
  newExecution.workflow = {
    ...newWorkflowObj,
    nodes: JSON.parse(decrypt(newWorkflowObj.nodes)),
  };
  return newExecution;
};

export const getExecutions = async (id) => {
  const executions = await db.any(
    "SELECT * FROM execution WHERE workflow_id = ${id}",
    {
      id,
    }
  );
  return executions.map((execution) => {
    const workflowObj = execution.workflow;
    return {
      ...execution,
      workflow: {
        ...workflowObj,
        nodes: JSON.parse(decrypt(workflowObj.nodes)),
      },
    };
  });
};

// Metrics db

export const instantiateWorkflowMetrics = async (workflowObj) => {
  return await db.one(
    "INSERT INTO metric (workflow_id, total_executions, success_rate, avg_milliseconds_to_complete_workflow, node_failure_count, avg_milliseconds_to_complete_node, avg_volume_extracted_data) VALUES " +
      "(${workflow_id}, 0, -1, -1, '{}', '{}', '{}'",
    {
      workflow_id: workflowObj.id,
    }
  );
};

export const updateTotalExecutions = async (workflowID) => {
  return await db.any(
    "UPDATE metric SET total_executions = total_executions + 1 WHERE workflow_id = ${workflowID}",
    {
      workflowID: workflowID,
    }
  );
};

export const getMetricsForWorkflow = async (workflowID) => {
  return await db.one(
    "SELECT * FROM metric WHERE workflow_id = ${workflowID}",
    { workflowID: workflowID }
  );
};

export const updateSuccessRate = async (workflowID, successful) => {
  const totalExecutions = await db.one(
    "SELECT total_executions FROM metric WHERE workflow_id = ${workflowID}",
    { workflowID: workflowID }
  );
  const oldSuccessRate = await db.one(
    "SELECT success_rate FROM metric WHERE workflow_id = ${workflowID}",
    { workflowID: workflowID }
  );
  if (oldSuccessRate.success_rate === -1) {
    const newSuccessRate = successful ? 100 : 0;
    console.log(newSuccessRate);
    return await db.any(
      "UPDATE metric SET success_rate = ${successRate} WHERE workflow_id = ${workflowID}",
      {
        successRate: newSuccessRate,
        workflowID: workflowID,
      }
    );
  }
  const currentSuccessRate =
    oldSuccessRate.success_rate * totalExecutions.total_executions;
  const newSuccessRate = successful
    ? (currentSuccessRate + 100) / (totalExecutions.total_executions + 1)
    : currentSuccessRate / (totalExecutions.total_executions + 1);
  return await db.any(
    "UPDATE metric SET success_rate = ${successRate} WHERE workflow_id = ${workflowID}",
    { successRate: newSuccessRate, workflowID: workflowID }
  );
};

export const updateAverageTimeTaken = async (workflowID, timeTaken) => {
  const totalExecutions = await db.one(
    "SELECT total_executions FROM metric WHERE workflow_id = ${workflowID}",
    { workflowID: workflowID }
  );
  const oldAverageTimeTaken = await db.one(
    "SELECT avg_milliseconds_to_complete_workflow FROM metric WHERE workflow_id = ${workflowID}",
    { workflowID: workflowID }
  );
  if (oldAverageTimeTaken.avg_milliseconds_to_complete_workflow === -1) {
    return await db.any(
      "UPDATE metric SET avg_milliseconds_to_complete_workflow = ${time_taken} WHERE workflow_id = ${workflowID}",
      { time_taken: timeTaken, workflowID: workflowID }
    );
  }
  const totalTimeTaken =
    oldAverageTimeTaken.avg_milliseconds_to_complete_workflow *
    totalExecutions.total_executions;
  const newTimeTaken =
    (totalTimeTaken + timeTaken) / (totalExecutions.total_executions + 1);
  return await db.any(
    "UPDATE metric SET avg_milliseconds_to_complete_workflow = ${time_taken} WHERE workflow_id = ${workflowID}",
    { time_taken: newTimeTaken, workflowID: workflowID }
  );
};
