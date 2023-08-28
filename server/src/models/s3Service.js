import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { throwNDErrorAndUpdateDB } from "../utils/errors.js";
// import { fs } from "memfs";
// import * as fs from "fs";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: "us-east-2",
});

export const uploadFileToS3 = async (workflowObj, nodeObj, data) => {
  let uuid;
  if (nodeObj.data.output.uuid && workflowObj.active === false) {
    uuid = nodeObj.data.output.uuid;
    console.log("use existing id", uuid);
  } else {
    uuid = uuidv4();
    console.log("creating new id", uuid);
  }

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: uuid,
    Body: JSON.stringify(data),
  });

  try {
    await s3.send(command);
  } catch (err) {
    throwNDErrorAndUpdateDB(workflowObj, nodeObj, `S3 Error, ${err}`);
  }
  return uuid;
};

export const getFileFromS3 = async (workflowObj, nodeObj) => {
  if (!nodeObj.data || !nodeObj.data.output.uuid) {
    return;
  }
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: nodeObj.data.output.uuid,
  });
  try {
    const response = await s3.send(command);
    const str = await response.Body.transformToString();
    return JSON.parse(str);
  } catch (err) {
    throwNDErrorAndUpdateDB(workflowObj, nodeObj, `S3 Error, ${err}`);
  }
};
