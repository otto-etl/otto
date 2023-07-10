import express from "express";
import { startCron, stopCron } from "../utils/scheduleExec.js";
import { runJSCode } from "../utils/jsCodeExec.js";
import { runAPI } from "../utils/apiExec.js";
import { runPSQLCode } from "../utils/psqlExec.js";
import { getNode } from "../utils/node.js";
import { getWorkflow, updateNodesEdges } from "../models/workflowsService.js";
import { runWorkflow } from "../utils/workflowExec.js";
import { throwNDErrorAndUpdateDB } from "../utils/errors.js";
const router = express.Router();

//start cron job
router.put("/workflow/:id", async (req, res, next) => {
  const workflowID = req.params.id;
  try {
    const workflowObj = await getWorkflow(workflowID);
    if (workflowObj.active === true) {
      throw new Error("workflow already active");
    }
    await startCron(workflowObj);
    res.status(200).send(`workflow${workflowID} schedule triggered`);
  } catch (e) {
    next(e);
  }
});

//stop cron job
router.put("/stopworkflow/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const workflowObj = await getWorkflow(id);
    if (workflowObj.active === false) {
      throw new Error("workflow already deactivated");
    }
    stopCron(id);
    res.status(200).send(`workflow${id} schedule stopped`);
  } catch (e) {
    next(e);
  }
});

//execute node
router.post("/node", async (req, res, next) => {
  let { workflowID, nodeID, nodes, edges } = req.body;
  nodes = JSON.stringify(nodes);
  edges = JSON.stringify(edges);
  try {
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
    } else if (nodeObj.type !== "schedule") {
      const message = `Invalid Node Type: ${nodeObj.type}`;
      await throwNDErrorAndUpdateDB(workflowObj, nodeObj, message);
    }
    res.status(200).json(resData);
  } catch (e) {
    next(e);
  }
});

//execute workflow
router.post("/workflow/:id", async (req, res, next) => {
  const workflowID = req.params.id;
  const { nodes, edges } = req.body;
  try {
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
    next(e);
  }
});

export default router;
