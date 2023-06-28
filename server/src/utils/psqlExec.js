import pgPromise from "pg-promise";
import { getNode } from "./node.js";
import { updateWorkflowNodes } from "../models/pgService.js";

export const connectPSQL = async ({ userName, password, dbName }) => {
  const pgp2 = pgPromise();
  try {
    const db = await pgp2(
      `postgres://${userName}:${password}@localhost:5432/${dbName}`
    );
    return db;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const runPSQLCode = async (workflowObj, nodeObj) => {
  const prevNodeID = nodeObj.data.prev;
  const previousNode = getNode(workflowObj, prevNodeID);
  const { userName, password, dbName, sqlCode } = nodeObj.data;

  // console.log("prevNodeID", prevNodeID);
  // console.log("prevNode", previousNode);
  // console.log("Data attributes", userName, password, dbName);
  // console.log("SQL code", sqlCode);

  // the array of data we need to insert

  const isConnectionExists = pgp2.end() === undefined;

  // if (isConnectionExists) {
  //   console.log("Connection to the database already exists.");
  // } else {

  const db = await connectPSQL({ userName, password, dbName });

  //   console.log("No existing connection to the database.");
  // }

  const dataToInsert = previousNode.data.output.data;
  const regex = /\$\{([^}]+)\}/g;
  const insertFields = [...sqlCode.matchAll(regex)].map(
    (returnedData) => returnedData[1]
  );

  console.log("data to insert", dataToInsert);
  console.log("insert fields", insertFields);
  dataToInsert.forEach((obj) => {
    db.any(sqlCode, matchDataPropWithVarNames(insertFields, obj));
  });
};

const matchDataPropWithVarNames = (insertFields, obj) => {
  const result = {};
  insertFields.forEach((field) => (result[field] = obj[field]));
  return result;
};
