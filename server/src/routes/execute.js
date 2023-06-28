import express from "express";
import { startCron, stopCron } from "../utils/scheduleExec.js";
import { runJSCode } from "../utils/jsCodeExec.js";
import { runAPI } from "../utils/apiExec.js";
import { runPSQLCode } from "../utils/psqlExec.js";
import { getNode } from "../utils/node.js";
import { getWorkflow } from "../models/pgService.js";
const router = express.Router();

router.get("/workflow/:id", (req, res) => {
  try {
    const id = req.params.id;
    startCron(id);
    res.status(200).send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.get("/stopworkflow/:id", (req, res) => {
  try {
    const id = req.params.id;
    stopCron(id);
    res.status(200).send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.post("/node", async (req, res) => {
  try {
    const { workflowID, nodeID, nodes, edges } = req.body;
    //add pgService function that updates the nodes and edges fields of the database

    //execution
    const workflowObj = await getWorkflow(workflowID);
    const nodeObj = getNode(workflowObj, nodeID);
    console.log("EXTRACT");

    let resData;
    if (nodeObj.type === "extract") {
      console.log("nodeObj :", nodeObj);
      resData = await runAPI(workflowObj, nodeObj);
    } else if (nodeObj.type === "transform") {
      resData = await runJSCode(workflowObj, nodeObj);
    } else if (nodeObj.type === "load") {
      console.log("load fired");
      resData = await runPSQLCode(workflowObj, nodeObj);
    } else {
      res.status(403).send({ error: "Invalid node type" });
    }

    res.status(200).send(resData);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

export default router;
