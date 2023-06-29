import "./Workflow.css";
import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

import TriggerNode from "./TriggerNode";
import ExtractNode from "./ExtractNode";
import TransformNode from "./TransformNode";
import LoadNode from "./LoadNode";
import NodeModal from "./NodeModal";
import { updateInputs } from "../utils/utils";

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState("");

  useEffect(() => {
    const getWorkflow = async () => {
      const response = await axios.get(
        "http://localhost:3001/mock/workflows/1"
      );
      updateInputs(response.data.nodes);
      setNodes(response.data.nodes);
      setEdges(response.data.edges);
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
      workflowID: "1",
      nodes: newNodesArray,
      edges: edges,
    };
    let executionResult = await axios.post(
      "http://localhost:3001/mock/execute/node",
      payload
    );
    let currentNode = newNodesArray.find((node) => node.id === currentId);
    let nextNode = newNodesArray.find((node) => node.data.prev === currentId);
    currentNode.data.output = executionResult.data;
    if (nextNode) {
      nextNode.data.input = executionResult.data;
    }
  };

  const onNodeClick = useCallback((event, object) => {
    let contents;
    switch (object.type) {
      case "trigger":
        contents = "Trigger modal goes here";
        break;
      case "extract":
        contents = "Extract modal goes here";
        break;
      case "transform":
        contents = "Transform IDE goes here";
        break;
      case "load":
        contents = "Load modal goes here";
        break;
      default:
        break;
    }

    axios.put("http://localhost:3001/mock/workflows/1", {
      nodes,
      edges,
    });

    openModal({ ...object, contents: contents });
  });

  const handleExecuteAll = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:3001/mock/execute/workflow/1",
      {
        workflowID: "1",
        nodes,
        edges,
      }
    );
    updateInputs(res.data.nodes);
    setNodes(res.data.nodes);
    setEdges(res.data.edges);
  };

  /* ReactFlow throws a console warning here:
  
  It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.
  The thing is we did define it outside of the component -- that was directly from the tutorial -- so I need to look into why this is still happening
  */
  return (
    <div className="grid">
      <ReactFlowProvider>
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
            <NodeModal
              nodeObj={modalData}
              setModalIsOpen={setModalIsOpen}
              onSaveExecute={onSaveExecute}
              runExecution={runExecution}
            />
          ) : null}
        </ReactFlow>
        <button onClick={handleExecuteAll}>Save and Execute</button>
      </ReactFlowProvider>
    </div>
  );
};

export default Workflow;
