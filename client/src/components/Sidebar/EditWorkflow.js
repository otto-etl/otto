import React from "react";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { Workflow } from "lucide-react";

const EditWorkflow = ({ selectedEditIndex, handleEditListItemClick }) => {
  return (
    <List component="nav" sx={{ pt: 0, pb: "20px" }}>
      <ListItemButton
        selected={selectedEditIndex === 0}
        onClick={(event) => handleEditListItemClick(event, 0)}
        sx={{ gap: "10px" }}
      >
        <Workflow size={20} strokeWidth={2} />
        <ListItemText primary="Edit Test Workflow" />
      </ListItemButton>
    </List>
  );
};

export default EditWorkflow;
