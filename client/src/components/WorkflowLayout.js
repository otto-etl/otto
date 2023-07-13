import "./Workflow.css";
import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  Panel,
  Controls,
} from "reactflow";
import { Background } from "@reactflow/background";
import { useParams } from "react-router-dom";
import "reactflow/dist/style.css";

import Modal from "./Modals/Modal";
import ScheduleNode from "./Nodes/ScheduleNode";
import ExtractNode from "./Nodes/ExtractNode";
import TransformNode from "./Nodes/TransformNode";
import LoadNode from "./Nodes/LoadNode";
import NodeCreationMenu from "./NodeCreationMenu";
import WorkflowNavbar from "./Navigation/WorkflowNavbar";
import GlobalNavbar from "./Navigation/GlobalNavbar";
import Sidebar from "./Sidebar/Sidebar";
import {
  isExtractNode,
  isScheduleNode,
  isTransformNode,
  isLoadNode,
  convertLabel,
  workflowHasOrphanNodes,
} from "../utils/utils";
import { formatNodeLabel } from "../utils/workflowLayout";
import {
  getWorkflowAPI,
  saveAndExecuteNode,
  saveWorkflow,
  saveAndExecuteWorkflow,
  toggleWorkflowStatus,
} from "../services/api";
import "../index.css";

import {
  AppBar,
  Box,
  Button,
  Typography,
  FormControlLabel,
  FormGroup,
  Switch,
  Toolbar,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const connectionLineStyle = { stroke: "#fff" };
const snapGrid = [20, 20];
// See comment below about React Flow nodeTypes warning
const nodeTypes = {
  schedule: ScheduleNode,
  extractApi: ExtractNode,
  extractPsql: ExtractNode,
  extractMongo: ExtractNode,
  transform: TransformNode,
  load: LoadNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const WorkflowLayout = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]); // useNodesState, useEdgesState are React Flow-specific
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [editNodes, setEditNodes] = useNodesState([]); // useNodesState, useEdgesState are React Flow-specific
  const [editEdges, setEditEdges] = useEdgesState([]);

  // Create editNodes and editEdges
  // When a execution list item is clicked
  // Save the currentState of the edges and nodes to editsNodes and editEdges
  // When "edit test workflow" is clicked
  // Set nodes and edges state back to editNodes and editEdges
  // Reset editNodes and editEdges
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState("");
  const [active, setActive] = useState(false);
  const [hasOrphans, setHasOrphans] = useState(false);
  const [wfName, setWfName] = useState("");
  const [wfError, setWfError] = useState();
  const [message, setMessage] = useState("");
  const [currentDB, setCurrentDB] = useState("");
  const [logView, setLogView] = useState(false);
  const wfID = useParams().id;

  useEffect(() => {
    const getWorkflow = async () => {
      const response = await getWorkflowAPI(wfID);
      // console.log("active:", response.active);

      setNodes(response.nodes);
      setEdges(response.edges);
      setActive(response.active);
      setWfName(response.name);
      getCurrentDB(response.nodes, response.active);
    };
    getWorkflow();
  }, [setNodes, setEdges, setActive, setWfName, wfID]);

  useEffect(() => {
    console.log("call to workflowHasOrphanNodes");
    let orphans = workflowHasOrphanNodes(nodes, edges);
    setHasOrphans(orphans);
    if (orphans) {
    }
  }, [edges]);

  const handleExecutionListItemClick = (executionNodes, executionEdges) => {
    if (editNodes.length === 0 && editEdges.length === 0) {
      setEditNodes(nodes);
      setEditEdges(edges);
    }
    setNodes(executionNodes);
    setEdges(executionEdges);
    setLogView(true);
  };

  const handleEditWorkflowListItemClick = () => {
    setNodes(editNodes);
    setEdges(editEdges);
    setEditNodes([]);
    setEditEdges([]);
    setLogView(false);
  };

  const openModal = (nodeData) => {
    setModalIsOpen(true);
    setModalData(nodeData);
  };

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      const targetNode = nodes.find((node) => {
        return node.id === params.target;
      });
      let newTargetNode = copyAndUpdateTargetNode(targetNode, params.source);
      let newNodes = nodes.map((node) => {
        if (node.id !== params.target) {
          return node;
        }
        return newTargetNode;
      });
      setNodes(newNodes);
      return setEdges((eds) =>
        addEdge(
          { ...params, animated: false, style: { stroke: "#000033" } },
          eds
        )
      );
    },
    [nodes, setNodes, edges, setEdges]
  );

  const copyAndUpdateTargetNode = (targetNode, sourceId) => {
    let newTargetNode = { ...targetNode };
    newTargetNode.data = { ...targetNode.data };
    newTargetNode.data.prev = sourceId;
    return newTargetNode;
  };

  const handleIsValidConnection = (edge) => {
    return (
      (isScheduleNode(edge.source, nodes) &&
        isExtractNode(edge.target, nodes)) ||
      (isExtractNode(edge.source, nodes) &&
        isTransformNode(edge.target, nodes)) ||
      (isTransformNode(edge.source, nodes) &&
        isTransformNode(edge.target, nodes)) ||
      (isTransformNode(edge.source, nodes) && isLoadNode(edge.target, nodes))
    );
  };

  const onSaveExecute = async (currentId, updatedNodeData) => {
    let newNodesArray = updateNodeObject(currentId, updatedNodeData);
    await runExecution(currentId, newNodesArray); // mutates newNodesArray
    // setNodes(newNodesArray);
  };

  const updateNodeObject = (currentId, updatedData) => {
    let nextNode = nodes.find((node) => node.data.prev === currentId);
    return nodes.map((node) => {
      if (
        node.id !== currentId &&
        (!nextNode || (nextNode && node.id !== nextNode.id))
      ) {
        return node;
      }
      let newNode = { ...node };
      let newData = { ...node.data };
      if (nextNode && node.id === nextNode.id) {
        newNode.data = newData;
        return newNode;
      }
      Object.keys(updatedData).forEach((key) => {
        newData[key] = updatedData[key];
      });
      newNode.data = updatedData;
      return newNode;
    });
  };

  const runExecution = async (currentId, newNodesArray) => {
    let payload = {
      nodeID: currentId,
      workflowID: wfID,
      nodes: newNodesArray,
      edges: edges,
    };
    //on successfull execution returns output data
    //on execution failure returns error node object
    // let executionResult = await saveAndExecuteNode(payload);
    // let currentNode = newNodesArray.find((node) => node.id === currentId);

    // if (executionResult.data && executionResult.data.error) {
    //   currentNode.data = executionResult.data;
    // } else {
    //   currentNode.data.output = executionResult;
    // }
    let executionResult = await saveAndExecuteNode(payload);
    // console.log("execution result", executionResult.nodes);
    setNodes(executionResult.nodes);
    setEdges(executionResult.edges);
  };

  const onCreateNode = async (nodeType) => {
    let newNodeId = crypto.randomUUID();
    let newNode = {
      id: newNodeId,
      type: nodeType,
      position: { x: 650, y: -125 }, // Arbitrary hardcoded location, below menu
      data: {
        label: formatNodeLabel(nodeType),
        output: "",
      },
    };
    addExtraNodeProperties(newNode);
    // console.log(newNode);

    let newNodes = [...nodes, newNode];
    await saveWorkflow(1, { nodes: newNodes, edges });
    setNodes(newNodes);
    setHasOrphans(true); // New nodes are always orphans
  };

  const addExtraNodeProperties = (newNode) => {
    // All of these values are hardcoded defaults, TODO: extract them to constants/decide what they are
    const TOTAL_MINUTES_IN_A_DAY = 1440;

    switch (newNode.type) {
      case "schedule": {
        var currentDate = new Date();
        newNode.data.startTime = currentDate.setDate(currentDate.getDate() + 1);
        newNode.data.startTime = currentDate.setHours(0, 0, 0, 0);
        newNode.data.intervalInMinutes = TOTAL_MINUTES_IN_A_DAY;
        break;
      }
      case "extract": {
        newNode.data.url = "https://dog.ceo/api/breeds/list/all";
        newNode.data.json = {};
        newNode.data.httpVerb = "GET";
        break;
      }
      case "transform": {
        newNode.data.jsCode =
          "let array1 = []; \
          let data1 = data.input1.message \
          for(const prop in data1) { \
              array1.push({breed:prop, num:data1[prop].length}) \
          } \
          data = array1";
        break;
      }
      case "load": {
        newNode.data.userName = "INSERT YOUR USERNAME HERE";
        newNode.data.password = "INSERT YOUR PASSWORD HERE";
        newNode.data.tableName = "dog";
        newNode.data.host = "localhost";
        newNode.data.port = "5432";
        newNode.data.dbName = "dog";
        newNode.data.sqlCode =
          "INSERT INTO dog(breed, count) VALUES(${breed}, ${num})";
        break;
      }
      default: {
        break;
      }
    }
  };

  const onDeleteNode = async (nodeId) => {
    let newNodes = nodes.filter((node) => node.id !== nodeId);
    let newEdges = edges.filter(
      (edge) => nodeId !== edge.target && nodeId !== edge.source
    );

    await saveWorkflow(1, { nodes: newNodes, edges: newEdges });
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const onNodeClick = useCallback((event, object) => {
    saveWorkflow(wfID, { nodes, edges });
    openModal({ ...object });
  });

  const handleExecuteAll = async (e) => {
    e.preventDefault();
    handleMessage(`Executing ${wfName}`, `Execution finished`, 2000, 2000);
    const res = await saveAndExecuteWorkflow(wfID, {
      workflowID: wfID,
      nodes,
      edges,
    });
    if (res.errMessage) {
      if (res.errName === "NodeError" || res.errName === "ExternalError")
        res.errMessage =
          "Node execution failure, please checked the failed node";
      setWfError(res.errMessage);
      setTimeout(() => {
        setWfError(null);
      }, 3000);
    } else {
      setWfError(null);
    }
    setNodes(res.nodes);
    setEdges(res.edges);
  };

  const handleToggleActive = async (e) => {
    setActive(e.target.checked);
    await toggleWorkflowStatus(wfID, e.target.checked);
    if (e.target.checked) {
      handleMessage(`Workflow ${wfName} is now active!`, null, 2000, null);
    } else {
      handleMessage(`Workflow ${wfName} is now inactive!`, null, 2000, null);
    }
    getCurrentDB(nodes, e.target.checked);
  };

  const handleSaveWorkflow = async (e) => {
    e.preventDefault();
    handleMessage("Saving...", "Saved!", 500, 1000);
    await saveWorkflow(wfID, { nodes, edges });
  };

  const handleMessage = (message1, message2, laps1, laps2) => {
    setMessage(message1);

    const handleMessage2 = () => {
      setMessage(message2);
      setTimeout(() => setMessage(""), laps2);
    };

    const handleMessage1 = () => {
      if (message2) {
        handleMessage2();
      } else {
        setMessage("");
      }
    };

    setTimeout(handleMessage1, laps1);
  };

  const getCurrentDB = (nodes, active) => {
    // console.log(nodes, active);
    const loadNode = nodes.find((node) => node.type === "load");
    // console.log(loadNode);

    if (loadNode && !active) {
      setCurrentDB(
        `host:${loadNode.data.host} db:${loadNode.data.dbName} user:${loadNode.data.userName}`
      );
    } else if (loadNode && active) {
      setCurrentDB(
        `host:${loadNode.data.hostPD} db:${loadNode.data.dbNamePD} user:${loadNode.data.userNamePD}`
      );
    } else {
      setCurrentDB("No load node yet");
    }
  };

  const getPrevNodesOutput = (currentNodeID) => {
    const sourceEdges = edges.filter((edge) => edge.target === currentNodeID);
    const input = {};
    let idx = 0;
    //adding an index to each output is just for material UI tabs to work
    sourceEdges.forEach((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      input[idx] = {
        label: convertLabel(sourceNode.data.label),
        data: sourceNode.data.output.data,
      };
      idx++;
    });
    return input;
  };

  /* ReactFlow throws a console warning here:
  
  It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.
  The thing is we did define it outside of the component -- that was directly from the tutorial -- so I need to look into why this is still happening
  */

  return (
    <>
      <GlobalNavbar />
      <WorkflowNavbar
        wfName={wfName}
        message={message}
        active={active}
        orphans={hasOrphans}
        handleSaveWorkflow={handleSaveWorkflow}
        handleExecuteAll={handleExecuteAll}
        handleToggleActive={handleToggleActive}
        logView={logView}
      />
      {wfError ? (
        <Alert
          sx={{ margin: "10px 0 0 0", border: "2px solid #B99" }}
          severity="error"
        >
          <AlertTitle sx={{ fontWeight: "700", color: "#200" }}>
            Error:
          </AlertTitle>
          <p style={{ fontWeight: "600", textIndent: "10px" }}>{wfError}</p>
        </Alert>
      ) : null}
      <div className="grid">
        <Sidebar
          workflowID={wfID}
          handleExecutionListItemClick={handleExecutionListItemClick}
          handleEditWorkflowListItemClick={handleEditWorkflowListItemClick}
        />
        <ReactFlow
          style={{ flex: 1 }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeUpdate={onEdgeUpdate}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionLineStyle={connectionLineStyle}
          snapToGrid={true}
          snapGrid={snapGrid}
          defaultViewport={defaultViewport}
          fitView
          fitViewOptions={{ maxZoom: 1 }}
          attributionPosition="bottom-left"
          isValidConnection={handleIsValidConnection}
        >
          <Controls />
          <Background color={"#a7a7ae"} style={{ background: "#f3f4f6" }} />
          <Panel position="top-right">
            <NodeCreationMenu onCreateNode={onCreateNode} logView={logView} />
          </Panel>
          {modalIsOpen ? (
            <Modal
              modalIsOpen={modalIsOpen}
              handleOpen={() => setModalIsOpen(true)}
              handleClose={() => setModalIsOpen(false)}
              onSaveExecute={onSaveExecute}
              onDeleteNode={onDeleteNode}
              runExecution={runExecution}
              nodeObj={modalData}
              disabled={logView || active}
              getPrevNodesOutput={getPrevNodesOutput}
            />
          ) : null}
        </ReactFlow>
      </div>
    </>
  );
};

export default WorkflowLayout;
