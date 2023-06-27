import pgPromise from "pg-promise";
const pgp = pgPromise();

const db = pgp(
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:5432/${process.env.DBNAME}`
);

export const getAllWorkflows = async () => {
  return await db.many("SELECT * FROM workflow");
};

export const getWorkflow = async (id) => {
  return await db.one("SELECT * FROM workflow WHERE id = ${id}", { id });
};
