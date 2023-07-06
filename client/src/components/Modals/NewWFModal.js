import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { createNewWF } from "../../services/api";
import { useNavigate } from "react-router-dom";

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 100,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const NewWFModal = ({ newWFVisible, handleCloseNewWFModal }) => {
  const [newWfName, setNewWfName] = useState("New Workflow");
  const navigate = useNavigate();

  const handleSaveNewWF = async (e) => {
    e.preventDefault();
    const data = await createNewWF({ name: newWfName });
    navigate(`/workflow/${data.id}`);
    // handleCloseNewWFModal();
  };

  return (
    <Modal
      open={newWFVisible}
      onClose={handleCloseNewWFModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={boxStyle}>
        <Container maxWidth="sm">
          <TextField
            id="outlined-basic"
            label="Workflow Name"
            value={newWfName}
            onChange={(e) => setNewWfName(e.target.value)}
          />
          <br></br>
          <Button variant="contained" onClick={handleSaveNewWF}>
            Create
          </Button>
          <Button variant="contained" onClick={handleCloseNewWFModal}>
            Cancel
          </Button>
        </Container>
      </Box>
    </Modal>
  );
};

export default NewWFModal;
