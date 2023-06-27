import { useState, useRef } from "react";
import ReactDom from "react-dom";

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
  };

  const handleSubmit = (event) => {
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
          {props.nodeObj.data.input ? props.obj.data.input : "N/A"}
        </p>
        <p>
          <strong>Previous output:</strong>{" "}
          {props.nodeObj.data.output ? props.obj.data.output : "N/A"}
        </p>
        <form onSubmit={handleSubmit}>
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
            <button type="submit">Submit</button>
          </p>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default NodeModal;
