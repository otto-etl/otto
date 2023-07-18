import pgPromise from "pg-promise";
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
  return await db.any("SELECT * FROM workflow");
};

export const getActiveWorkflows = async () => {
  return await db.many("SELECT * FROM workflow WHERE active = true");
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

export const insertNewWF = async (name, nodes, edges) => {
  return await db.one(
    "INSERT INTO workflow (name, nodes, edges, created_at, updated_at, active) VALUES " +
      "(${name}, ${nodes}, ${edges}, NOW(), NOW(), false) RETURNING *",
    {
      name: name,
      nodes: nodes,
      edges: edges,
    }
  );
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
  return await db.one(
    "INSERT INTO execution (start_time, end_time, successful, workflow_id, current_version, workflow) VALUES " +
      "(${start_time}, NOW(), ${successful}, ${workflow_id}, TRUE, ${workflowObj}) RETURNING *",
    {
      start_time: workflowObj.startTime,
      successful: successful,
      workflow_id: workflowObj.id,
      workflowObj: JSON.stringify(workflowObj),
    }
  );
};

export const getExecutions = async (id) => {
  return await db.any("SELECT * FROM execution WHERE workflow_id = ${id}", {
    id,
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
}

export const updateTotalExecutions = async (workflowID) => {
  return await db.any(
    "UPDATE metric SET total_executions = total_executions + 1 WHERE workflow_id = ${workflowID}",
    {
	  workflowID: workflowID,
	}
  );
}

export const getMetricsForWorkflow = async (workflowID) => {
  return await db.one("SELECT * FROM metric WHERE workflow_id = ${workflowID}", { workflowID: workflowID });
};

export const updateSuccessRate = async (workflowID, successful) => {
  const totalExecutions = await db.one("SELECT total_executions FROM metric WHERE workflow_id = ${workflowID}", { workflowID: workflowID, });
  const oldSuccessRate = await db.one("SELECT success_rate FROM metric WHERE workflow_id = ${workflowID}", { workflowID: workflowID, });
  if (oldSuccessRate.success_rate === -1) {
	const newSuccessRate = successful ? 100 : 0;
    return await db.any("UPDATE metric SET success_rate = ${successRate} WHERE workflow_id = ${workflowID}", 
	  { 
	    successRate: newSuccessRate, 
		workflowID: workflowID, 
	  }
     );
  }
  const currentSuccessRate = oldSuccessRate.success_rate * totalExecutions.total_executions;
  const newSuccessRate = successful ? (currentSuccessRate + 100) / (totalExecutions.total_executions + 1) : (currentSuccessRate) / (totalExecutions.total_executions + 1);
  return await db.any("UPDATE metric SET success_rate = ${successRate} WHERE workflow_id = ${workflowID}", 
    { successRate: newSuccessRate,
	  workflowID: workflowID 
	}
  );  
}

export const updateAverageTimeTaken = async (workflowID, timeTaken) => {
  const totalExecutions = await db.one("SELECT total_executions FROM metric WHERE workflow_id = ${workflowID}", { workflowID: workflowID, });
  const oldAverageTimeTaken = await db.one("SELECT avg_milliseconds_to_complete_workflow FROM metric WHERE workflow_id = ${workflowID}", { workflowID: workflowID, });
  if (oldAverageTimeTaken.avg_milliseconds_to_complete_workflow === -1) {
    return await db.any("UPDATE metric SET avg_milliseconds_to_complete_workflow = ${time_taken} WHERE workflow_id = ${workflowID}", { time_taken: timeTaken, workflowID: workflowID, });
  }
  const totalTimeTaken = oldAverageTimeTaken.avg_milliseconds_to_complete_workflow * totalExecutions.total_executions;
  const newTimeTaken = (totalTimeTaken + timeTaken) / (totalExecutions.total_executions + 1);
  return await db.any("UPDATE metric SET avg_milliseconds_to_complete_workflow = ${time_taken} WHERE workflow_id = ${workflowID}", 
    { time_taken: newTimeTaken,
	  workflowID: workflowID 
	}
  );  
};

export const updateAverageNodeTimeTaken = async (workflowID, nodeID, nodeName, nodeType, nodeTimeTaken) => {
  const nodeCompletionTimeMetrics = await db.one("SELECT avg_milliseconds_to_complete_node FROM metric WHERE workflow_id = ${workflowID}", { workflowID: workflowID, });
  let nodeCompletionObj = nodeCompletionTimeMetrics.avg_milliseconds_to_complete_node;
  if (!nodeCompletionObj[nodeID]) {
    nodeCompletionObj[nodeID] = { name: nodeName, type: nodeType, executions: 1, avg_time: nodeTimeTaken };
  }
  else {
    const totalTimeTaken = nodeCompletionObj[nodeID].avg_time * nodeCompletionObj[nodeID].executions;
	const newTimeTaken = (totalTimeTaken + nodeTimeTaken) / (nodeCompletionObj[nodeID].executions + 1);
    nodeCompletionObj[nodeID].executions += 1;
	nodeCompletionObj[nodeID].avg_time = newTimeTaken;
  }
  const nodeCompletionJSON = JSON.stringify(nodeCompletionObj);
  return await db.any("UPDATE metric SET avg_milliseconds_to_complete_node = ${nodeCompletionJSON} WHERE workflow_id = ${workflowID}",
    {
      nodeCompletionJSON: nodeCompletionJSON,
	  workflowID: workflowID
    }
  );
}

export const updateAverageNodeData = async (workflowID, nodeID, nodeName, nodeType, nodeData) => {
  const nodeDataMetrics = await db.one("SELECT avg_volume_extracted_data FROM metric WHERE workflow_id = ${workflowID}", { workflowID: workflowID, });
  const nodeDataVolume = Buffer.byteLength(JSON.stringify(nodeData.output));
  let nodeDataObj = nodeDataMetrics.avg_volume_extracted_data;
  if (!nodeDataObj[nodeID]) {
    nodeDataObj[nodeID] = { name: nodeName, type: nodeType, executions: 1, avg_volume: nodeDataVolume };
  }
  else {
    const totalData = nodeDataObj[nodeID].avg_volume * nodeDataObj[nodeID].executions;
	const newTotalData = (totalData + nodeDataVolume) / (nodeDataObj[nodeID].executions + 1);
    nodeDataObj[nodeID].executions += 1;
	nodeDataObj[nodeID].avg_volume = newTotalData;
  }
  const nodeDataVolumeJSON = JSON.stringify(nodeDataObj);
  return await db.any("UPDATE metric SET avg_volume_extracted_data = ${nodeDataVolumeJSON} WHERE workflow_id = ${workflowID}",
    {
      nodeDataVolumeJSON: nodeDataVolumeJSON,
	  workflowID: workflowID
    }
  );
}

export const updateNodeFailureMetrics = async (workflowID, nodeID) => {
  const nodeFailureMetrics = await db.one("SELECT node_failure_count FROM metric WHERE workflow_id = ${workflowID}", { workflowID: workflowID, });
  let nodeFailureObj = nodeFailureMetrics.node_failure_count; 
  if (!nodeFailureObj[nodeID]) {
    nodeFailureObj[nodeID] = 1;
  }
  else {
    nodeFailureObj[nodeID] += 1;
  }
  const nodeFailureJSON = JSON.stringify(nodeFailureObj);
  return await db.any("UPDATE metric SET node_failure_count = ${nodeFailureJSON} WHERE workflow_id = ${workflowID}",
    {
       nodeFailureJSON: nodeFailureJSON,
	   workflowID: workflowID
	}
  );
}
