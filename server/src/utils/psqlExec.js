import pgPromise from "pg-promise";
import { updateNodes } from "../models/workflowsService.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";
import { getInputData } from "./node.js";
import { nodeInputvalidation } from "./nodeInput.js";
const pgp = pgPromise();

let dbs = {};

export const runPSQLCode = async (workflowObj, nodeObj) => {
  await nodeInputvalidation(workflowObj, nodeObj);

  let {
    userName,
    password,
    dbName,
    host,
    port,
    userNamePD,
    passwordPD,
    dbNamePD,
    hostPD,
    portPD,
    sqlCode,
  } = nodeObj.data;

  const cnCredentials =
    workflowObj.active && nodeObj.type === "load"
      ? {
          userName: userNamePD,
          password: passwordPD,
          dbName: dbNamePD,
          host: hostPD,
          port: portPD,
        }
      : { userName, password, dbName, host, port };

  const db = connectPSQL(cnCredentials);

  //test if connection to db can be made with provided credentials
  await testConnection(db, workflowObj, nodeObj);

  sqlCode = addReturnStr(sqlCode);
  //add returning statement if the code doesn't have one
  let returnValues;

  //for each row in the input dataset, insert into db
  try {
    if (nodeObj.type === "load") {
      returnValues = await runSqlForLoad(sqlCode, workflowObj, nodeObj, db);
    }
    if (nodeObj.type === "extractPsql") {
      returnValues = await runSqlForExtract(sqlCode, db);
    }
  } catch (e) {
    const message = `Error running psql code: ${e.message}`;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }

  nodeObj.data.output = { data: returnValues };
  nodeObj.data.error = null;
  await updateNodes(workflowObj);
  return returnValues;
};

const runSqlForLoad = async (sqlCode, workflowObj, nodeObj, db) => {
  let returnValues = [];
  let inputData = await getInputData(workflowObj, nodeObj);
  inputData = inputData.data;
  const insertFields = getInputFields(sqlCode);
  for (const obj of inputData) {
    const returnValue = await db.any(
      sqlCode,
      matchDataPropsWithVarNames(insertFields, obj)
    );
    returnValues = returnValues.concat(returnValue);
  }
  return returnValues;
};

const runSqlForExtract = async (sqlCode, db) => {
  return await db.any(sqlCode);
};

// connect to PSQL with user credentials
const connectPSQL = ({ userName, host, port, password, dbName }) => {
  const cnStr = `postgres://${userName}:${password}@${host}:${port}/${dbName}`;
  let db;
  if (dbs[cnStr]) {
    console.log("use existing psql DB connection: ", cnStr);
    return dbs[cnStr];
  } else {
    console.log("create new psql DB connection: ", cnStr);
    db = pgp(cnStr);
    dbs[cnStr] = db;
    return db;
  }
};

const matchDataPropsWithVarNames = (insertFields, obj) => {
  const result = {};
  insertFields.forEach((field) => (result[field] = obj[field]));
  return result;
};

const addReturnStr = (sqlCode) => {
  if (
    sqlCode.toUpperCase().includes("RETURNING") ||
    sqlCode.toUpperCase().trim().slice(0, 6) === "SELECT"
  ) {
    return sqlCode;
  } else if (!sqlCode.includes(";")) {
    return sqlCode + "RETURNING * ;";
  } else {
    return sqlCode.replace(";", " RETURNING * ;");
  }
};

const testConnection = async (db, workflowObj, nodeObj) => {
  try {
    const connection = await db.connect();
    console.log("psql db connection success");
    connection.done();
  } catch (e) {
    const message = `Unable to connect to psql database: ${e.message}`;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }
};

const getInputFields = (sqlCode) => {
  const regex = /\$\{([^}]+)\}/g;
  const insertFields = [...sqlCode.matchAll(regex)].map((returnedData) => {
    return returnedData[1];
  });
  return insertFields;
};
