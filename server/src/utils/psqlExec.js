import pgPromise from "pg-promise";
import { getNode } from "./node.js";
import { updateNodes } from "../models/pgService.js";
const pgp = pgPromise();

let dbs = {};

// connect to PSQL with user credentials
export const connectPSQL = async ({
  userName,
  host,
  port,
  password,
  dbName,
}) => {
  const cnStr = `postgres://${userName}:${password}@${host}:${port}/${dbName}`;
  console.log(dbs, cnStr);
  let db;
  if (dbs[cnStr]) {
    console.log("use existing", cnStr);
    return dbs[cnStr];
  } else {
    try {
      console.log("create new", cnStr);
      db = await pgp(cnStr);
      dbs[cnStr] = db;
      return db;
    } catch (e) {
      throw new Error(`Unable to connect to database with error ${e.message}`);
    }
  }
};

export const runPSQLCode = async (workflowObj, nodeObj) => {
  const prevNodeID = nodeObj.data.prev;
  const previousNode = getNode(workflowObj, prevNodeID);
  let { userName, password, dbName, sqlCode, host, port } = nodeObj.data;
  let db;
  try {
    db = await connectPSQL({ userName, password, dbName, host, port });
  } catch (e) {
    throw new Error(`Unable to connect to database with error ${e.message}`);
  }

  //if no input data throw an error
  const inputData = previousNode.data.output.data;
  if (inputData.length === 0) {
    throw new Error(`No data from previous node: ${previousNode.type}`);
  }

  const regex = /\$\{([^}]+)\}/g;
  const insertFields = [...sqlCode.matchAll(regex)].map((returnedData) => {
    return returnedData[1];
  });

  //add returning statement if the code doesn't have one
  sqlCode = addReturnStr(sqlCode);
  let returnValues = [];

  //for each role in the input dataset insert into db
  try {
    for (const obj of inputData) {
      const returnValue = await db.any(
        sqlCode,
        matchDataPropsWithVarNames(insertFields, obj)
      );
      returnValues = returnValues.concat(returnValue);
    }
  } catch (e) {
    throw new Error(`Error running psql code ${error.message}`);
  }

  nodeObj.data.output = returnValues;
  await updateNodes(workflowObj);
  return returnValues;
};

const matchDataPropsWithVarNames = (insertFields, obj) => {
  const result = {};
  insertFields.forEach((field) => (result[field] = obj[field]));
  return result;
};

const addReturnStr = (sqlCode) => {
  if (sqlCode.toUpperCase().includes("RETURNING")) {
    return sqlCode;
  } else if (!sqlCode.includes(";")) {
    return sqlCode + "RETURNING * ;";
  } else {
    return sqlCode.replace(";", " RETURNING * ;");
  }
};
