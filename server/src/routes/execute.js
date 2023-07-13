import express from "express";
import { startCron, stopCron } from "../utils/scheduleExec.js";
import { getNode, resetSubsequentOutputs } from "../utils/node.js";
import { getWorkflow, updateNodesEdges } from "../models/workflowsService.js";
import { runWorkflow } from "../utils/workflowExec.js";
import { executeNode } from "../utils/nodeExec.js";

const executeRouter = express.Router();

//start cron job
executeRouter.put("/workflow/:id", async (req, res, next) => {
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
executeRouter.put("/stopworkflow/:id", async (req, res, next) => {
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
executeRouter.post("/node", async (req, res, next) => {
  let { workflowID, nodeID, nodes, edges } = req.body;
  try {
    resetSubsequentOutputs(nodes, edges, nodeID);
    console.log(nodes);
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
    await executeNode(workflowObj, nodeObj);
    res
      .status(200)
      .json({ nodes: workflowObj.nodes, edges: workflowObj.edges });
  } catch (e) {
    next(e);
  }
});

//execute workflow
executeRouter.post("/workflow/:id", async (req, res, next) => {
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

export default executeRouter;
