import React, { useState } from "react";
import { Modal, Button, Box, TextField, Typography } from "@mui/material";
import { createNewWF } from "../../services/api";
import { useNavigate } from "react-router-dom";

const NewWFModal = ({ newWFVisible, handleCloseNewWFModal }) => {
  const [newWfName, setNewWfName] = useState();
  const navigate = useNavigate();

  const handleSaveNewWF = async (e) => {
    e.preventDefault();
    const data = await createNewWF({ name: newWfName });
    navigate(`/workflow/${data.id}`);
    // handleCloseNewWFModal();
  };

  const formsPopulated = () => {
    return newWfName;
  };

  return (
    <Modal
      open={newWFVisible}
      onClose={handleCloseNewWFModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "1px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: "4px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <Typography sx={{ fontSize: "18px" }}>
            Please provide a workflow name:
          </Typography>
          <TextField
            id="outlined-basic"
            label="Workflow Name"
            value={newWfName}
            onChange={(e) => setNewWfName(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: "20px" }}>
            <Button
              variant="contained"
              disabled={formsPopulated() ? false : true}
              onClick={handleSaveNewWF}
            >
              Create
            </Button>
            <Button
              variant="text"
              sx={{ textTransform: "capitalize", fontSize: "16px" }}
              onClick={handleCloseNewWFModal}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewWFModal;
