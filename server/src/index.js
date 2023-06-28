import "dotenv/config";
import express from "express";
import cors from "cors";
import workflowRoutes from "./routes/workflow.js";
import executeRoutes from "./routes/execute.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/workflows", workflowRoutes);
app.use("/execute", executeRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
