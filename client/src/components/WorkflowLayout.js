import "./Workflow.css";
import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  Panel,
} from "reactflow";
import { useParams } from "react-router-dom";
import "reactflow/dist/style.css";

import Modal from "./Modal";
import TriggerNode from "./TriggerNode";
import ExtractNode from "./ExtractNode";
import TransformNode from "./TransformNode";
import LoadNode from "./LoadNode";
import NodeModal from "./NodeModal";
import NodeCreationMenu from "./NodeCreationMenu";
import WorkflowNavbar from "./Navigation/WorkflowNavbar";
import GlobalNavbar from "./Navigation/GlobalNavbar";
import Sidebar from "./Sidebar/Sidebar";
import {
  updateInputs,
  isExtractNode,
  isTriggerNode,
  isTransformNode,
  isLoadNode,
} from "../utils/utils";
import {
  getWorkflowAPI,
  saveAndExecuteNode,
  saveWorkflow,
  saveAndExecuteWorkflow,
  toggleWorkflowStatus,
} from "../services/api";
import "../index.css";

const connectionLineStyle = { stroke: "#fff" };
const snapGrid = [20, 20];
// See comment below about React Flow nodeTypes warning
const nodeTypes = {
  trigger: TriggerNode,
  extract: ExtractNode,
  transform: TransformNode,
  load: LoadNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const Workflow = () => {
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
  const [wfName, setWfName] = useState("");
  const [message, setMessage] = useState("");
  const [currentDB, setCurrentDB] = useState("");
  const wfID = useParams().id;

  useEffect(() => {
    const getWorkflow = async () => {
      const response = await getWorkflowAPI(wfID);
      // console.log("active:", response.active);

      if (response) {
        updateInputs(response.nodes);
      }

      // console.log(Array.isArray(response.nodes));
      setNodes(response.nodes);
      setEdges(response.edges);
      setActive(response.active);
      setWfName(response.name);
      getCurrentDB(response.nodes, response.active);
    };
    getWorkflow();
  }, [setNodes, setEdges]);

  const handleExecutionListItemClick = (executionNodes, executionEdges) => {
    setEditEdges(edges);
    setEditNodes(nodes);
    setNodes(executionNodes);
    setEdges(executionEdges);
  };

  const handleEditWorkflowListItemClick = () => {
    setNodes(editNodes);
    setEdges(editEdges);
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
      let newEdge = { ...params, animated: true, style: { stroke: "#000033" } };
      return setEdges((eds) =>
        addEdge(
          { ...params, animated: true, style: { stroke: "#000033" } },
          eds
        )
      );
    },
    [nodes, edges]
  );

  const copyAndUpdateTargetNode = (targetNode, sourceId) => {
    let newTargetNode = { ...targetNode };
    newTargetNode.data = { ...targetNode.data };
    newTargetNode.data.prev = sourceId;
    return newTargetNode;
  };

  const handleIsValidConnection = (edge) => {
    return (
      (isTriggerNode(edge.source, nodes) &&
        isExtractNode(edge.target, nodes)) ||
      (isExtractNode(edge.source, nodes) &&
        isTransformNode(edge.target, nodes)) ||
      (isTransformNode(edge.source, nodes) && isLoadNode(edge.target, nodes))
    );
  };

  const onSaveExecute = async (currentId, updatedNodeData) => {
    let newNodesArray = updateNodeObject(currentId, updatedNodeData);
    await runExecution(currentId, newNodesArray); // mutates newNodesArray
    setNodes(newNodesArray);
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
    let currentNode = newNodesArray.find((node) => node.id === currentId);
    let nextNode = newNodesArray.find((node) => node.data.prev === currentId);
    currentNode.data.output = executionResult;
    if (nextNode) {
      nextNode.data.input = executionResult;
    }
  };

  const onCreateNode = async (nodeType) => {
    let newNodeId = crypto.randomUUID();
    let newNode = {
      id: newNodeId,
      type: nodeType,
      position: { x: 650, y: -125 }, // Arbitrary hardcoded location, below menu
      data: {
        label: `${nodeType[0].toUpperCase() + nodeType.slice(1)} node`,
        output: "",
      },
    };
    addExtraNodeProperties(newNode);
    // console.log(newNode);
    let newNodes = [...nodes, newNode];
    await saveWorkflow(1, { nodes: newNodes, edges });
    setNodes(newNodes);
  };

  const addExtraNodeProperties = (newNode) => {
    // All of these values are hardcoded defaults, TODO: extract them to constants/decide what they are
    const TOTAL_MINUTES_IN_A_DAY = 1440;

    switch (newNode.type) {
      case "trigger": {
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
        newNode.data.jscode =
          "for(const prop in data.message) { \
		  if (!data.message.breed) { \
			  data.message.breed=[{breed:prop, num:data.message[prop].length}] \
 			  } else { \
				  data.message.breed.push({breed:prop, num:data.message[prop].length}) \
				  }\
				  }\
			data = data.message.breed;";
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
    let contents;
    // switch (object.type) {
    //   case "trigger":
    //     contents = "Trigger modal goes here";
    //     break;
    //   case "extract":
    //     contents = "Extract modal goes here";
    //     break;
    //   case "transform":
    //     contents = "Transform IDE goes here";
    //     break;
    //   case "load":
    //     contents = "Load modal goes here";
    //     break;
    //   default:
    //     break;
    // }

    saveWorkflow(wfID, { nodes, edges });

    openModal({ ...object, contents: contents });
  });

  const handleExecuteAll = async (e) => {
    e.preventDefault();
    handleMessage(`Executing ${wfName}`, 2000);
    const res = await saveAndExecuteWorkflow(wfID, {
      workflowID: wfID,
      nodes,
      edges,
    });
    updateInputs(res.nodes);
    setNodes(res.nodes);
    setEdges(res.edges);
    handleMessage(`Execution finished`, 2000);
  };

  const handleToggleActive = async (e) => {
    setActive(e.target.checked);
    await toggleWorkflowStatus(wfID, e.target.checked);
    if (e.target.checked) {
      handleMessage(`Workflow ${wfName} is now activated!`, 2000);
    } else {
      handleMessage(`Workflow ${wfName} is now deactivated!`, 2000);
    }
    getCurrentDB(nodes, e.target.checked);
  };

  const handleSaveWorkflow = async (e) => {
    e.preventDefault();
    handleMessage("Saving", 1000);
    await saveWorkflow(wfID, { nodes, edges });
    handleMessage("Saved", 2000);
  };

  const handleMessage = (message, laps) => {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, laps);
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
      setCurrentDB("production db fields to be created");
    } else {
      setCurrentDB("No load node yet");
    }
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
        handleSaveWorkflow={handleSaveWorkflow}
        handleExecuteAll={handleExecuteAll}
        handleToggleActive={handleToggleActive}
      />
      <div className="grid">
        <Sidebar
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
          attributionPosition="bottom-left"
          isValidConnection={handleIsValidConnection}
        >
          <Panel position="top-right">
            <NodeCreationMenu onCreateNode={onCreateNode} />
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
              active={active}
            />
          ) : null}
        </ReactFlow>
      </div>
      {/* <p>{currentDB}</p> */}
    </>
  );
};

export default Workflow;
