import { MongoMemoryServer } from "mongodb-memory-server";
const mongod = new MongoMemoryServer({
  instance: {
    port: 27017, // by default choose any free port
    ip: "127.0.0.1", // by default '127.0.0.1', for binding to all IP addresses set it to `::,0.0.0.0`,
    dbName: "testDB", // by default '' (empty string)
    dbPath: "string", // by default create in temp directory
    replSet: string, // by default no replica set, replica set name
    auth: true, // by default `mongod` is started with '--noauth', start `mongod` with '--auth'
  },
});
