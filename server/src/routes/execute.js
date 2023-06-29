import express from "express";
import { startCron, stopCron } from "../utils/scheduleExec.js";
import { runJSCode } from "../utils/jsCodeExec.js";
import { runAPI } from "../utils/apiExec.js";
import { runPSQLCode } from "../utils/psqlExec.js";
import { getNode, getAllNodesInOrder } from "../utils/node.js";
import { getWorkflow, updateNodesEdges } from "../models/pgService.js";
const router = express.Router();

router.get("/workflow/:id", (req, res) => {
  try {
    const id = req.params.id;
    startCron(id);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/stopworkflow/:id", (req, res) => {
  try {
    const id = req.params.id;
    stopCron(id);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/node", async (req, res) => {
  try {
    const { workflowID, nodeID, nodes, edges } = req.body;

    //update nodes and edges in DB by workflowID
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

router.post("/workflow/:id", async (req, res) => {
  try {
    const workflowID = req.params.id;
    const { nodes, edges } = req.body;
    console.log("nodes:", nodes);
    console.log("edges", edges);
    //update nodes and edges in DB by workflowID
    await updateNodesEdges({
      workflowID,
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
    });

    //get workflow object
    const workflowObj = await getWorkflow(workflowID);
    const nodesToExecute = getAllNodesInOrder(workflowObj);
    for (const nodeObj of nodesToExecute) {
      if (nodeObj.type === "extract") {
        await runAPI(workflowObj, nodeObj);
      } else if (nodeObj.type === "transform") {
        await runJSCode(workflowObj, nodeObj);
      } else if (nodeObj.type === "load") {
        await runPSQLCode(workflowObj, nodeObj);
      } else {
        res.status(403).json({ error: "Invalid node type" });
      }
    }
    const workflowObjNew = await getWorkflow(String(workflowID));
    res
      .status(200)
      .json({ nodes: workflowObjNew.nodes, edges: workflowObjNew.edges });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
