import express from "express";
import { startCron, stopCron } from "../utils/scheduleExec.js";
import { runJSCode } from "../utils/jsCodeExec.js";
import { getNode } from "../utils/node.js";
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
    const { workflowID, nodeID } = req.body;
    const node = await getNode(workflowID, nodeID);
    let resData;
    if (node.type === "transform") {
      resData = await runJSCode(workflowID, node);
    } else if (node.type === "load") {
    } else if (node.type === "extract") {
    }
    res.status(200).send(resData);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

export default router;
