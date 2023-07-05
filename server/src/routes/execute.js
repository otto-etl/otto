import express from "express";
import { startCron, stopCron } from "../utils/scheduleExec.js";
import { runJSCode } from "../utils/jsCodeExec.js";
import { runAPI } from "../utils/apiExec.js";
import { runPSQLCode } from "../utils/psqlExec.js";
import { getNode } from "../utils/node.js";
import { getWorkflow, updateNodesEdges } from "../models/pgService.js";
import { runWorkflow } from "../utils/workflowExec.js";
const router = express.Router();

//start cron job
router.put("/workflow/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const workflowObj = await getWorkflow(id);
    if (workflowObj.active === true) {
      throw new Error("work flow already active");
    }
    startCron(workflowObj);
    res.status(200).send(`workflow${id} schedule triggered`);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//stop cron job
router.put("/stopworkflow/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const workflowObj = await getWorkflow(id);
    if (workflowObj.active === false) {
      throw new Error("work flow already deactivated");
    }
    stopCron(id);
    res.status(200).send(`workflow${id} schedule stopped`);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//execute node
router.post("/node", async (req, res) => {
  try {
    let { workflowID, nodeID, nodes, edges } = req.body;
    nodes = JSON.stringify(nodes);
    edges = JSON.stringify(edges);
    //update nodes and edges in DB by workflowID
    await updateNodesEdges({
      workflowID,
      nodes,
      edges,
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
    } else if (nodeObj.type !== "trigger") {
      res.status(403).json({ error: `Invalid node type: ${nodeObj.type}` });
    }
    res.status(200).json(resData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//execute workflow
router.post("/workflow/:id", async (req, res) => {
  try {
    const workflowID = req.params.id;
    const { nodes, edges } = req.body;
    //update nodes and edges in DB by workflowID
    await updateNodesEdges({
      workflowID,
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
    });

    const workflowObj = await getWorkflow(workflowID);
    await runWorkflow(workflowObj);
    const workflowObjNew = await getWorkflow(String(workflowID));
    res
      .status(200)
      .json({ nodes: workflowObjNew.nodes, edges: workflowObjNew.edges });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
