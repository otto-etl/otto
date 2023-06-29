import pgPromise from "pg-promise";
import { getNode } from "./node.js";
import { updateNodes } from "../models/pgService.js";
const pgp = pgPromise();

let db;

export const connectPSQL = async ({ userName, password, dbName }) => {
  try {
    return pgp(`postgres://${userName}:${password}@localhost:5432/${dbName}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const runPSQLCode = async (workflowObj, nodeObj) => {
  try {
    const prevNodeID = nodeObj.data.prev;
    const previousNode = getNode(workflowObj, prevNodeID);
    let { userName, password, dbName, sqlCode } = nodeObj.data;

    if (!db) {
      db = await connectPSQL({ userName, password, dbName });
      console.log("Connection to the database established.");
    } else {
      console.log("Using existing database connection.");
    }

    const dataToInsert = previousNode.data.output.data;
    const regex = /\$\{([^}]+)\}/g;
    const insertFields = [...sqlCode.matchAll(regex)].map((returnedData) => {
      return returnedData[1];
    });

    //add returning statement if the code doesn't have one
    sqlCode = addReturnStr(sqlCode);
    let returnValues = [];

    for (const obj of dataToInsert) {
      const returnValue = await db.any(
        sqlCode,
        matchDataPropsWithVarNames(insertFields, obj)
      );
      returnValues = returnValues.concat(returnValue);
    }
    return returnValues;
  } catch (error) {
    console.error("Error running PSQL code:", error);
  }
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