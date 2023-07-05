import "./Workflow.css";
import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import { useParams } from "react-router-dom";
import "reactflow/dist/style.css";

import Modal from "./Modal";
import TriggerNode from "./TriggerNode";
import ExtractNode from "./ExtractNode";
import TransformNode from "./TransformNode";
import LoadNode from "./LoadNode";
import NodeModal from "./NodeModal";
import { updateInputs } from "../utils/utils";
import {
  getWorkflowAPI,
  saveAndExecuteNode,
  saveWorkflow,
  saveAndExecuteWorkflow,
  toggleWorkflowStatus,
} from "../services/api";
import "../index.css";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState("");
  const [active, setActive] = useState(false);
  const [wfName, setWfName] = useState("");
  const [message, setMessage] = useState("");
  const wfID = useParams().id;

  useEffect(() => {
    const getWorkflow = async () => {
      const response = await getWorkflowAPI(wfID);
      console.log("active:", response.active);
      updateInputs(response.nodes);
      // console.log(Array.isArray(response.nodes));
      setNodes(response.nodes);
      setEdges(response.edges);
      setActive(response.active);
      setWfName(response.name);
    };
    getWorkflow();
  }, []);

  const openModal = (nodeData) => {
    setModalIsOpen(true);
    setModalData(nodeData);
  };

  // Not implemented yet, from tutorial, throws a warning about no dependencies in dependency array, need to check how loadbearing that is
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, animated: true, style: { stroke: "#000033" } },
          eds
        )
      ),
    []
  );

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

  const onNodeClick = useCallback((event, object) => {
    console.log("Inside of onNodeClick");
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

  /* ReactFlow throws a console warning here:
  
  It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.
  The thing is we did define it outside of the component -- that was directly from the tutorial -- so I need to look into why this is still happening
  */
  // console.log(nodes);
  return (
    <div className="grid">
      <p>{wfName}</p>
      <p>{message}</p>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={active}
              onChange={handleToggleActive}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label="Active"
          defaultChecked
          labelPlacement="start"
        />
      </FormGroup>
      <Button
        variant="contained"
        color="primary"
        disabled={active ? true : false}
        onClick={handleSaveWorkflow}
      >
        Save
      </Button>
      <Button variant="contained" color="primary" onClick={handleExecuteAll}>
        Execute Workflow
      </Button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineStyle={connectionLineStyle}
        snapToGrid={true}
        snapGrid={snapGrid}
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-left"
      >
        {modalIsOpen ? (
          <Modal
            modalIsOpen={modalIsOpen}
            handleOpen={() => setModalIsOpen(true)}
            handleClose={() => setModalIsOpen(false)}
            onSaveExecute={onSaveExecute}
            runExecution={runExecution}
            nodeObj={modalData}
            active={active}
          />
        ) : null}
      </ReactFlow>
    </div>
  );
};

export default Workflow;
