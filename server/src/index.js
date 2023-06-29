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

app.get("/mock/workflows/:id", (req, res) => {
  const workflowObject = {
    workflow: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "Schedule",
          startTime: "26 Jun 2023 7:16:00 CST",
          intervalInMinutes: "1",
          output: "",
        },
        position: {
          x: 0,
          y: 50,
        },
        sourcePosition: "right",
      },
      {
        id: "2",
        type: "extract",
        data: {
          prev: "1",
          label: "API",
          url: "https://dog.ceo/api/breeds/list/all",
          httpVerb: "GET",
          jsonBody: {},
          output: "",
        },
        position: {
          x: 210,
          y: 90,
        },
        targetPosition: "left",
      },
      {
        id: "3",
        type: "transform",
        data: {
          prev: "2",
          label: "QUERY",
          jsCode: "",
          output: "",
        },
        position: {
          x: 425,
          y: 5,
        },
        targetPosition: "left",
      },
      {
        id: "4",
        type: "load",
        data: {
          prev: "3",
          label: "POSTGRES",
          userName: "postgres",
          password: "password",
          port: "5432",
          sqlCode: "INSERT INTO breed() VALUES()",
          output: "",
        },
        position: {
          x: 650,
          y: 75,
        },
        targetPosition: "left",
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        animated: false,
        style: {
          stroke: "#000033",
        },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        animated: false,
        style: {
          stroke: "#000033",
        },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        animated: false,
        style: {
          stroke: "#000033",
        },
      },
    ],
  };

  res.status(200).json(workflowObject);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
