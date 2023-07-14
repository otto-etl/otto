import "dotenv/config";
import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import mockRoutes from "./routes/mock.js";
import workflowRoutes from "./routes/workflow.js";
import executeRoutes from "./routes/execute.js";
import executionRoutes from "./routes/executionRoutes.js";
import { errorHandler } from "./middleware.js/errorHandler.js";

const app = express();
// app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use("/workflows", workflowRoutes);
app.use("/execute", executeRoutes);
app.use("/executions", executionRoutes);
app.use("/mock", mockRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 3001;

https
  .createServer(
    {
      key: fs.readFileSync("otto_cert/key.pem"),
      cert: fs.readFileSync("otto_cert/cert.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

// app.listen(PORT, () => {

// });
