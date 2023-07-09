import pgPromise from "pg-promise";
import { updateNodes } from "../models/pgService.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";
import { getInputData } from "./node.js";

const pgp = pgPromise();

let dbs = {};

// connect to PSQL with user credentials
const connectPSQL = ({ userName, host, port, password, dbName }) => {
  const cnStr = `postgres://${userName}:${password}@${host}:${port}/${dbName}`;
  let db;
  if (dbs[cnStr]) {
    console.log("use existing load DB connection: ", cnStr);
    return dbs[cnStr];
  } else {
    console.log("create new load DB connection: ", cnStr);
    db = pgp(cnStr);
    dbs[cnStr] = db;
    return db;
  }
};

export const runPSQLCode = async (workflowObj, nodeObj) => {
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

  const cnCredentials = workflowObj.active
    ? {
        userName: userNamePD,
        password: passwordPD,
        dbName: dbNamePD,
        host: hostPD,
        port: portPD,
      }
    : { userName, password, dbName, host, port };

  console.log(cnCredentials);
  const db = connectPSQL(cnCredentials);

  //test if connection to db can be made with provided credentials
  await testConnection(db, workflowObj, nodeObj);

  //get input data from previous nodes, currently assuming one input
  let inputData = await getInputData(workflowObj, nodeObj);

  //assuming load node only have 1 source of input
  inputData = inputData.data;
  const insertFields = getInputFields(sqlCode);
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
    const message = `Error running psql code: ${e.message}`;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  }

  nodeObj.data.output = returnValues;
  nodeObj.data.error = null;
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

const testConnection = async (db, workflowObj, nodeObj) => {
  try {
    const connection = await db.connect();
    console.log("load db connection success");
    connection.done();
  } catch (e) {
    const message = `Unable to connect to load database: ${e.message}`;
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
