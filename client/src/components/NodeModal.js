import { useState, useRef } from "react";
import ReactDom from "react-dom";
import axios from 'axios';

const NodeModal = (props) => {
  const [output, setOutput] = useState("");
  const [keyValues, setKeyValues] = useState(JSON.stringify(props.nodeObj.data));

  const modalRef = useRef();
  const closeModal = (event) => {
    if (event.target === modalRef.current) {
      props.setModalIsOpen(false);
    }
  };
  
  const updateKeyValues = (event) => {
    setKeyValues(event.target.value);
  };

  const updateOutput = (event) => {
    setOutput(event.target.value);
  };
 
  const handleSaveExecuteNode = (event) => {
    event.preventDefault();
    handleSaveNode();
    //handleExecuteNode();
    props.setModalIsOpen(false);
  }
  
  const handleSaveNode = () => {
    props.onSaveExecute(props.nodeObj.id, JSON.parse(keyValues));   
  }
 
  /*const handleSaveNode = async () => {
    const response = await axios.put(
      "http://localhost:3001/mock/workflows/1", JSON.parse(keyValues));
    props.onEditNodeData(props.nodeObj.id, response.data);
  };

  const handleExecuteNode = () => {
    props.runExecution(props.nodeObj.id);
  };*/

  return ReactDom.createPortal(
    <div id="modal-container" ref={modalRef} onClick={closeModal}>
      <div id="modal">
        <p>{props.nodeObj.contents}</p>
        <p>
          <strong>Previous input:</strong>{" "}
          {props.nodeObj.data.input ? props.nodeObj.data.input : "N/A"}
        </p>
        <p>
          <strong>Previous output:</strong>{" "}
          {props.nodeObj.data.output ? props.nodeObj.data.output : "N/A"}
        </p>
    <form onSubmit={handleSaveExecuteNode}>
      <p><label htmlFor="node-data">Current node data:</label></p>
          <textarea style={{resize: "none"}} cols="50" rows="3" type="text" value={keyValues} onChange={updateKeyValues} />
      <p><button type="submit">Save and execute</button></p>
    </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default NodeModal;
