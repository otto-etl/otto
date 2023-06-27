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
  
  const handleEditNode = async (event) => {
    event.preventDefault();
    const response = await axios.put(
      "http://localhost:3001/mock/workflows/1", JSON.parse(keyValues));
	props.onEditNodeData(props.nodeObj.id, response.data);
	props.setModalIsOpen(false);
  };

  const handleExecuteNode = (event) => {
    event.preventDefault();
    props.onUpdateNextOutput(props.nodeObj.id, output);
    props.setModalIsOpen(false);
  };

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
		<form onSubmit={handleEditNode}>
		  <p><label htmlFor="node-data">Update current node info:</label></p>
		  <input size="25" name="node-data" type="text" value={keyValues} onChange={updateKeyValues} />
		  <button type="submit">Update</button>
		</form>
        <form onSubmit={handleExecuteNode}>
          <p>
            <label htmlFor="output">Mock execution:</label>
          </p>
          <input
            name="output"
            type="text"
            value={output}
            onChange={updateOutput}
          />
          <p>
            <button type="submit">Execute</button>
          </p>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default NodeModal;
