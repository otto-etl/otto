import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import ScheduleModal from "./Modals/ScheduleModal";

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1400,
  height: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function BasicModal({
  modalIsOpen,
  handleOpen,
  handleClose,
  nodeObj,
  onSaveExecute,
  onDeleteNode,
  runExecution,
}) {
  const handleSaveExecuteNode = (event, formValues) => {
    event.preventDefault();
    handleSaveNode(formValues);
    //handleExecuteNode();
    handleClose();
  };

  const handleSaveNode = (formValues) => {
    console.log(formValues);
    onSaveExecute(nodeObj.id, formValues);
  };

  console.log("nodeObj.data insde basicModal", nodeObj.data);

  const handleDelete = (event) => {  
    event.preventDefault();
	onDeleteNode(nodeObj.id);
	handleClose();
  }

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={modalIsOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle}>
          <Stack direction="row">
            <Container maxWidth="sm">
              <p>Input</p>
              <Box sx={{ bgcolor: "#cfe8fc" }}>
                {nodeObj.data ? <JsonView src={nodeObj.data.input} /> : null}
              </Box>
            </Container>
            <Container maxWidth="sm">
              <p>Details</p>
              {nodeObj.type === "trigger" ? (
                <ScheduleModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
                  handleDelete={handleDelete}
                />
              ) : null}
              {nodeObj.type === "extract" ? (
                <ScheduleModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
                  handleDelete={handleDelete}
                />
              ) : null}
              {nodeObj.type === "transform" ? (
                <ScheduleModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
				  handleDelete={handleDelete}
                />
              ) : null}
              {nodeObj.type === "load" ? (
                <ScheduleModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
				  handleDelete={handleDelete}
                />
              ) : null}
            </Container>
            <Container maxWidth="sm">
              <p>Output</p>
              <Box sx={{ bgcolor: "#cfe8fc" }}>
                {console.log(nodeObj.data)}
                {nodeObj.data ? <JsonView src={nodeObj.data.output} /> : null}
              </Box>
            </Container>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default BasicModal;
