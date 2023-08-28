import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: "us-east-2",
});

export const uploadFileToS3 = async (key, data) => {
  console.log("S3:", "key:", key, "data:", data, "bucket", process.env.BUCKET);
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: key,
    Body: JSON.stringify(data),
  });

  try {
    await s3.send(command);
  } catch (err) {
    throw new Error("S3 err:" + err.toString());
  }
};

export const getFileFromS3 = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: key,
  });
  try {
    const response = await s3.send(command);
    const str = await response.Body.transformToString();
    return JSON.parse(str);
  } catch (err) {
    throw new Error("S3 err:" + err.toString());
  }
};
