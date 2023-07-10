import pgPromise from "pg-promise";
const pgp = pgPromise();

const db = pgp(
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/${process.env.EXECUTION_DBNAME}`
);

export const insertNewExecution = async (successful, workflowObj) => {
  return await db.one(
    "INSERT INTO execution (start_time, end_time, successful, workflow_id, current_version, workflow) VALUES " +
      "(to_timestamp(${start_time}), NOW(), ${successful}, ${workflow_id}, TRUE, ${workflowObj}) RETURNING *",
    {
      start_time: workflowObj.startTime,
      successful: successful,
      workflow_id: workflowObj.id,
      workflowObj: JSON.stringify(workflowObj),
    }
  );
};

export const getExecutions = async (id) => {
  return await db.many("SELECT * FROM execution WHERE workflow_id = ${id}", {
    id,
  });
};
