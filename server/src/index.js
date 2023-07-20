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

app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use("/api/workflows", workflowRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/executions", executionRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/mock", mockRoutes);
app.use(errorHandler);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
}
console.log("port", process.env.PORT);
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`${process.env.NODE_ENV} mode, listening on port ${PORT}`);
});
// }

export default app;
