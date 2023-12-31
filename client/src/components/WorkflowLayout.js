import "./Workflow.css";
import "reactflow/dist/style.css";
import "../index.css";
import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  Panel,
  Controls,
  MiniMap,
  useStoreApi,
} from "reactflow";
import { Background } from "@reactflow/background";
import { useParams } from "react-router-dom";

import ViewAlert from "./Alert/ViewAlert";
import Modal from "./Modals/Modal";
import ScheduleNode from "./Nodes/ScheduleNode";
import ExtractPsqlNode from "./Nodes/ExtractPsqlNode";
import ExtractApiNode from "./Nodes/ExtractApiNode";
import ExtractMongoNode from "./Nodes/ExtractMongoNode";
import TransformNode from "./Nodes/TransformNode";
import LoadNode from "./Nodes/LoadNode";
import NodeCreationMenu from "./NodeCreationMenu";
import MetricsModal from "./Modals/MetricsModal.js";
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
  getMetrics,
} from "../services/api";
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import { BarChartBig } from "lucide-react";

const connectionLineStyle = { stroke: "#fff" };
const snapGrid = [20, 20];
// See comment below about React Flow nodeTypes warning
const nodeTypes = {
  schedule: ScheduleNode,
  extractApi: ExtractApiNode,
  extractPsql: ExtractPsqlNode,
  extractMongo: ExtractMongoNode,
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
  const [metricsModalOpen, setMetricsModalOpen] = React.useState(false);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(false);
  const [hasOrphans, setHasOrphans] = useState(false);
  const [wfName, setWfName] = useState("");
  const [wfError, setWfError] = useState();
  const [message, setMessage] = useState("");
  const [logView, setLogView] = useState(false);
  const wfID = useParams().id;
  const store = useStoreApi();

  const nodeColor = (node) => {
    switch (node.type) {
      case "schedule":
        return "#ed912d";
      case "transform":
        return "#319a9c";
      case "load":
        return "#a56fd2";
      default:
        return "#5d92f5";
    }
  };

  useEffect(() => {
    const getWorkflow = async () => {
      const response = await getWorkflowAPI(wfID);
      setNodes(response.nodes);
      setEdges(response.edges);
      setActive(response.active);
      setWfName(response.name);
    };
    getWorkflow();
  }, [setNodes, setEdges, setActive, setWfName, wfID]);

  useEffect(() => {
    let orphans = workflowHasOrphanNodes(nodes, edges);
    setHasOrphans(orphans);
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
    setError(nodeData.data.error);
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
    await runExecution(currentId, newNodesArray);
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

    let executionResult = await saveAndExecuteNode(payload);
    setNodes(executionResult.nodes);
    setEdges(executionResult.edges);

    const returnedNodeObj = executionResult.nodes.find(
      (node) => node.id === currentId
    );

    setModalData(returnedNodeObj);
    setError(returnedNodeObj.data.error);
  };

  const calculateNewNodePosition = () => {
    const {
      height,
      width,
      transform: [transformX, transformY, zoomLevel],
    } = store.getState();

    const zoomMultiplier = 1 / zoomLevel;

    // Figure out the center of the current viewport
    const centerX = -transformX * zoomMultiplier + (width * zoomMultiplier) / 2;
    const centerY =
      -transformY * zoomMultiplier + (height * zoomMultiplier) / 2;

    const NODE_WIDTH = 300;
    const NODE_HEIGHT = 67;

    const nodeWidthOffset = NODE_WIDTH / 2;
    const nodeHeightOffset = NODE_HEIGHT / 2;

    const currentYOverlapOffset = 300;

    const position = {
      x: centerX - nodeWidthOffset,
      y: centerY - nodeHeightOffset - currentYOverlapOffset,
    };

    return position;
  };

  const onCreateNode = async (nodeType) => {
    let newNodeId = crypto.randomUUID();
    let newNode = {
      id: newNodeId,
      type: nodeType,
      position: calculateNewNodePosition(),
      data: {
        label: formatNodeLabel(nodeType),
        output: "",
      },
    };

    addExtraNodeProperties(newNode);
    let newNodes = [...nodes, newNode];
    await saveWorkflow(wfID, { nodes: newNodes, edges });
    setNodes(newNodes);
    setHasOrphans(true); // New nodes are always orphans
  };

  const addExtraNodeProperties = (newNode) => {
    const TOTAL_MINUTES_IN_A_DAY = 1440;

    switch (newNode.type) {
      case "schedule": {
        var currentDate = new Date();
        newNode.data.startTime = currentDate.setDate(currentDate.getDate() + 1);
        newNode.data.startTime = currentDate.setHours(0, 0, 0, 0);
        newNode.data.intervalInMinutes = TOTAL_MINUTES_IN_A_DAY;
        break;
      }
      case "extractApi": {
        newNode.data.url = "";
        newNode.data.json = {};
        newNode.data.httpVerb = "GET";
        break;
      }
      case "extractMongo": {
        newNode.data.host = "";
        newNode.data.port = "";
        newNode.data.defaultDatabase = "";
        newNode.data.username = "";
        newNode.data.password = "";
        newNode.data.collection = "";
        newNode.data.query = "{}";
        newNode.data.limit = "10";
        newNode.data.connectionFormat = "Standard";

        break;
      }
      case "extractPsql": {
        newNode.data.userName = "";
        newNode.data.password = "";
        newNode.data.host = "";
        newNode.data.port = "";
        newNode.data.dbName = "";
        newNode.data.sqlCode = "SELECT * FROM table_name;";
        break;
      }
      case "transform": {
        newNode.data.jsCode =
          "//You can access previous nodes' data through 'data.(name of input tab, lowerCamelCase)'/\n" +
          "//Assign your return value to the variable 'data'; do not write 'return' in your code";
        break;
      }
      case "load": {
        newNode.data.userName = "";
        newNode.data.password = "";
        newNode.data.host = "";
        newNode.data.port = "";
        newNode.data.dbName = "";
        newNode.data.userNamePD = "";
        newNode.data.passwordPD = "";
        newNode.data.hostPD = "";
        newNode.data.portPD = "";
        newNode.data.dbNamePD = "";
        newNode.data.sqlCode = "";
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

    await saveWorkflow(wfID, { nodes: newNodes, edges: newEdges });
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const onNodeClick = useCallback((event, object) => {
    saveWorkflow(wfID, { nodes, edges });
    openModal({ ...object });
  });

  const handleExecuteAll = async (e) => {
    e.preventDefault();
    // handleMessage(`Executing ${wfName}`, `Execution finished`, 2000, 2000);
    handleMessage(`Executing workflow...`, `Execution finished`, 2000, 2000);
    const res = await saveAndExecuteWorkflow(wfID, {
      workflowID: wfID,
      nodes,
      edges,
    });
    if (res.errMessage) {
      if (res.errName === "NodeError" || res.errName === "ExternalError")
        res.errMessage =
          "Node execution failure. Please check the failed node.";
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
    const checked = e.target.checked;
    try {
      await toggleWorkflowStatus(wfID, checked);
      setActive(checked);
    } catch (e) {
      setWfError(e.response.data.errMessage);
      // setActive(!checked);
      setTimeout(() => {
        setWfError(null);
      }, 3000);
    }
    if (checked) {
      handleMessage(`Workflow is now active!`, null, 2000, null);
    } else {
      handleMessage(`Workflow is now inactive!`, null, 2000, null);
    }
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

  const handleMetricsButtonClick = (event) => {
    event.preventDefault();
    setMetricsModalOpen(true);
  };

  const parseMetrics = async () => {
    const metricsData = await getMetrics(wfID);
    return metricsData;
  };

  const handleCloseMetricsModal = (e) => {
    e.preventDefault();
    setMetricsModalOpen(false);
  };

  return (
    <>
      <GlobalNavbar onHomePage={false} />
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

      <div className="grid">
        {wfError ? (
          <Alert
            sx={{
              border: "1px solid #B99",
              position: "absolute",
              top: "15px",
              left: "calc(50% - 149px)",
              marginLeft: "298px",
              transform: "translate(-50%, 0)",
              zIndex: "1",
            }}
            severity="error"
          >
            <AlertTitle sx={{ marginBottom: 0 }}>{wfError}</AlertTitle>
          </Alert>
        ) : null}
        <Sidebar
          workflowID={wfID}
          handleExecutionListItemClick={handleExecutionListItemClick}
          handleEditWorkflowListItemClick={handleEditWorkflowListItemClick}
          active={active}
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
          <Panel position="top-right" style={{ marginRight: "24px" }}>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
              }}
            >
              <NodeCreationMenu
                onCreateNode={onCreateNode}
                logView={logView}
                active={active}
              />
              <Button
                variant="outlined"
                sx={{
                  textTransform: "capitalize",
                  display: "flex",
                  gap: "10px",
                  margin: "0",
                }}
                onClick={handleMetricsButtonClick}
              >
                <BarChartBig size={18} />
                Active Metrics
              </Button>
            </Box>
            {metricsModalOpen ? (
              <MetricsModal
                metrics={parseMetrics()}
                metricsModalOpen={metricsModalOpen}
                handleCloseMetricsModal={handleCloseMetricsModal}
                workflowID={wfID}
              />
            ) : null}
          </Panel>
          <Panel position="top-center">
            {logView && !active ? <ViewAlert message={"Log View"} /> : null}
            {!logView && active ? (
              <ViewAlert message={"Workflow is Active"} />
            ) : null}
            {logView && active ? (
              <ViewAlert message={"Log View - Workflow is Active"} />
            ) : null}
          </Panel>
          <MiniMap
            nodeStrokeWidth={3}
            nodeColor={nodeColor}
            zoomable
            pannable
          />
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
              error={error}
            />
          ) : null}
        </ReactFlow>
      </div>
    </>
  );
};

export default WorkflowLayout;
