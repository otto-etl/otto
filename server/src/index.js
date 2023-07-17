import "dotenv/config";
import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import mockRoutes from "./routes/mock.js";
import workflowRoutes from "./routes/workflow.js";
import executeRoutes from "./routes/execute.js";
import executionRoutes from "./routes/executionRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";
import { errorHandler } from "./middleware.js/errorHandler.js";

const app = express();
// app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use("/workflows", workflowRoutes);
app.use("/execute", executeRoutes);
app.use("/executions", executionRoutes);
app.use("/metrics", metricsRoutes);
app.use("/mock", mockRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "PRODUCTION") {
  https
    .createServer(
      {
        key: fs.readFileSync(process.env.KEY_PATH),
        cert: fs.readFileSync(process.env.CERT_PATH),
      },
      app
    )
    .listen(PORT, () => {
      console.log(`Production mode, listening on port ${PORT}`);
    });
}

app.listen(PORT, () => {
  console.log(`Development mode, using http, listening on port ${PORT}`);
});
