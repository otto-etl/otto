import express from "express";
import { startCron, stopCron } from "../utils/scheduleExec.js";
import { runJSCode } from "../utils/jsCodeExec.js";
import { runAPI } from "../utils/apiExec.js";
import { runPSQLCode } from "../utils/psqlExec.js";
import { getNode } from "../utils/node.js";
import { getWorkflow, updateNodesEdges } from "../models/pgService.js";
const router = express.Router();

router.get("/workflow/:id", (req, res) => {
  try {
    const id = req.params.id;
    startCron(id);
    res.status(200).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/stopworkflow/:id", (req, res) => {
  try {
    const id = req.params.id;
    stopCron(id);
    res.status(200).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/node", async (req, res) => {
  try {
    const { workflowID, nodeID, nodes, edges } = req.body;

    //update nodes and edges by workflowID
    await updateNodesEdges({
      workflowID,
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
    });

    //get workflow object
    const workflowObj = await getWorkflow(workflowID);
    const nodeObj = getNode(workflowObj, nodeID);

    //execute node according to node type
    let resData;
    if (nodeObj.type === "extract") {
      resData = await runAPI(workflowObj, nodeObj);
    } else if (nodeObj.type === "transform") {
      resData = await runJSCode(workflowObj, nodeObj);
    } else if (nodeObj.type === "load") {
      resData = await runPSQLCode(workflowObj, nodeObj);
    } else {
      res.status(403).json({ error: "Invalid node type" });
    }
    res.status(200).json(resData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
