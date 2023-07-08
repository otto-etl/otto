import React from "react";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { Network, Workflow } from "lucide-react";

const EditWorkflow = ({ selectedCurrentIndex, handleCurrentListItemClick }) => {
  return (
    <List component="nav" sx={{ pt: 0, pb: "20px" }}>
      <ListItemButton
        selected={selectedCurrentIndex === 0}
        onClick={(event) => handleCurrentListItemClick(event, 0)}
        sx={{ gap: "10px" }}
      >
        <Workflow size={20} strokeWidth={2} />
        <ListItemText primary="Edit Test Workflow" />
      </ListItemButton>
    </List>
  );
};

export default EditWorkflow;
