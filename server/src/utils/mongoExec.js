import { MongoClient, ServerApiVersion } from "mongodb";
import { updateNodes } from "../models/workflowsService.js";
import { throwNDErrorAndUpdateDB } from "./errors.js";

export const runMongo = async (workflowObj, nodeObj) => {
  const {
    host,
    port,
    defaultDatabase,
    collection,
    username,
    password,
    query,
    limit,
    connectionFormat,
  } = nodeObj.data;

  let uri;
  if (connectionFormat === "Standard") {
    uri = `mongodb://${username}:${password}@${host}:${port}/${defaultDatabase}`;
  } else if (connectionFormat === "DNSSeedList") {
    uri = `mongodb+srv://${username}:${password}@${host}/${defaultDatabase}`;
  }

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server
    await client.connect();

    const data = await client
      .db(defaultDatabase)
      .collection(collection)
      .find(JSON.parse(query))
      .limit(Number(limit));

    nodeObj.data.output = { data: await data.toArray() };
    nodeObj.data.error = null;

    await updateNodes(workflowObj);
  } catch (e) {
    const message = `Mongodb connection failed. Please check the form fields for incorrect information`;
    await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};
