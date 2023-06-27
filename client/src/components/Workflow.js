import './Workflow.css';
import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import ReactDom from "react-dom";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

import TriggerNode from './TriggerNode';
import ExtractNode from './ExtractNode';
import TransformNode from './TransformNode';
import LoadNode from './LoadNode';

import '../index.css';

const connectionLineStyle = { stroke: '#fff' };
const snapGrid = [20, 20];
// See comment below about React Flow nodeTypes warning
const nodeTypes = {
  trigger: TriggerNode,
  extract: ExtractNode,
  transform: TransformNode,
  load: LoadNode
};

const NodeModal = (props) => {
  const [output, setOutput] = useState("");	
	
  const modalRef = useRef();
  const closeModal = (event) => {
    if (event.target === modalRef.current) {
      props.setModalIsOpen(false);
    }
  };
  
  const updateOutput = (event) => {
    setOutput(event.target.value);
  }
  
  const handleSubmit = (event) => {
	event.preventDefault();
    props.onUpdateNextOutput(props.obj.id, output);
	props.setModalIsOpen(false);
  }
  
  return ReactDom.createPortal(
    <div id="modal-container" ref={modalRef} onClick={closeModal}>
	  <div id="modal">
  	    <p>{props.obj.contents}</p>
		<p><strong>Previous input:</strong> {props.obj.data.input ? props.obj.data.input : "N/A"}</p>
		<p><strong>Previous output:</strong> {props.obj.data.output ? props.obj.data.output : "N/A"}</p>
		<form onSubmit={handleSubmit}>
		  <p><label htmlFor="output">Update output:</label></p>
		  <input name="output" type="text" value={output} onChange={updateOutput} />
		  <p><button type="submit">Submit</button></p>
		</form>
	  </div>
	</div>,
	document.getElementById("portal")
  );
}

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const CustomNodeFlow = () => {
  const initialNodes = [
      {
        id: '1',
        type: 'trigger',
        data: { label: 'Trigger',  input:"(none)", output:"" },
        position: { x: 0, y: 50 },
        sourcePosition: 'right',
      },
      {
        id: '2',
        type: 'extract',
        data: { prev: '1', label: 'Extract',  input:"", output:"" },
        position: { x: 210, y: 90 },
        targetPosition: 'left',
      },
      {
        id: '3',
        type: 'transform',
        data: { prev: '2', label: 'Transform', input:"", output:"" },
        position: { x: 425, y: 5 },
        targetPosition: 'left',
      },
	  {
        id: '4',
        type: 'load',
        data: { prev: '3', label: 'Load',  input:"", output:"" },
        position: { x: 650, y: 75 },
        targetPosition: 'left',
      }
  ];	
  
  const initialEdges = [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: false,
        style: { stroke: '#000033' },
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3',
        animated: false,
        style: { stroke: '#000033' },
      },
      {
        id: 'e3-4',
        source: '3',
        target: '4',
        animated: false,
        style: { stroke: '#000033' },
      }
    ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes); // useNodesState, useEdgesState are React Flow-specific
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState("");

  const openModal = (data) => {
    setModalIsOpen(true);
	setModalData(data);
  }

  // Not implemented yet, from tutorial, throws a warning about no dependencies in dependency array, need to check how loadbearing that is
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#000033' } }, eds)),
    []
  );
  
  const onUpdateNextOutput = useCallback( 
    (currentId, newOutput) => {
	  let currentNode = nodes.find(node => node.data.id === currentId);
	  let nextNode = nodes.find(node => node.data.prev === currentId);
	  let nextEdge = edges.find(edge => edge.source === currentId); 
      let newNodes = nodes.map((node) => {
        if (node.id !== currentId && (!nextNode || nextNode && node.id !== nextNode.id)) {
          return node;
        } 
		let newNode = {...node};
		let newData = {...node.data};
		let newPosition = {...node.position};
		node.id === currentId ? newData.output = newOutput : newData.input = newOutput;
		newData.position = newPosition;
		newNode.data = newData;
        return newNode;
      });
	  let newEdges = edges.map(edge => {
	    if (!nextEdge || edge.source !== currentId) {
		  return edge;
		}
		let newEdge = {...edge}
		newEdge.animated = true;
		return newEdge;
	  });
	  setNodes(newNodes);
	  setEdges(newEdges);
  }, [edges, nodes, setEdges, setNodes, modalIsOpen]); // Linter says modalIsOpen is unnecessary but it is load-bearing here, need to nail down why
  
  const onNodeClick = useCallback(
    (event, object) => {
	  let contents;
	  switch(object.type) {
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
	  openModal({...object, contents: contents});
	}		
  );
  
  /* ReactFlow throws a console warning here:
  
  It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.
  The thing is we did define it outside of the component -- that was directly from the tutorial -- so I need to look into why this is still happening
  */ 
  return (
  <div className="grid">
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
    {modalIsOpen ? <NodeModal obj={modalData} setModalIsOpen={setModalIsOpen} onUpdateNextOutput={onUpdateNextOutput} /> : null}
    </ReactFlow>
	</div>
  );
};

const App = () => {
  return (
    <div className="demo">
	  <h3>React Flow demo</h3>
      <CustomNodeFlow />
	</div>
  );
}

export default App;

/* import logo from './logo.svg';

import { useState, useEffect } from 'react';
import Draggable, {DraggableCore} from 'react-draggable';

const Grid = () => {
  const [contents, setContents] = useState('I am a node!');
  return(
    <div className="grid" id="grid">
	  <Node type="extract" />
	  <Node type="transform" />
	  <Node type="load" />
	</div>
  );
}

const Node = (props) => {
  const [contents, setContents] = useState('I am a node!');
  const [type, setType] = useState();;

  useEffect(() => {
	console.log(props.type);
    switch (props.type) {
	  case "extract":
	    setType("node extract");
		setContents("Extract");
		break;
	  case "transform":
		setType("node transform");
		setContents("Transform");
		break;
	  case "load":
		setType("node load");
		setContents("Load");
		break;
	}
  }, []);

  return(
    <Draggable bounds={{top: -180, left: -180, right: 180, bottom: 180}} >
      <div className={type}>{contents}</div>
	</Draggable>
  );
}

function App() {
  return (
  <div className="demo">
    <h3>React Draggable demo</h3>
	<Grid />
  </div>
  );
}

*/
