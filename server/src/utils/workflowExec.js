import { getAllNodesInOrder } from "./node.js";
import { runAPI } from "./apiExec.js";
import { runJSCode } from "./jsCodeExec.js";
import { runPSQLCode } from "./psqlExec.js";

export const runWorkflow = async (workflowObj) => {
  console.log("running workflow", workflowObj.id);
  const nodesToExecute = getAllNodesInOrder(workflowObj);
  for (const nodeObj of nodesToExecute) {
    if (nodeObj.type === "extract") {
      await runAPI(workflowObj, nodeObj);
    } else if (nodeObj.type === "transform") {
      await runJSCode(workflowObj, nodeObj);
    } else if (nodeObj.type === "load") {
      await runPSQLCode(workflowObj, nodeObj);
    } else if (nodeObj.type !== "trigger") {
      res.status(403).json({ error: "Invalid node type" });
    }
  }
};
