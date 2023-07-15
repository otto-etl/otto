import React from "react";
import { Divider, Menu, MenuItem, Button } from "@mui/material";
import { Plus } from "lucide-react";

/*
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
*/

const NodeCreationMenu = ({ onCreateNode, logView }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateNode = (event) => {
    const nodeType = event.target.dataset.value;
    console.log("string");
    onCreateNode(nodeType);
    handleClose();
  };

  return logView ? null : (
    <div>
      <Button
        // variant="contained"
        variant="outlined"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ textTransform: "capitalize", display: "flex", gap: "10px" }}
      >
        <Plus size={16} />
        Create Node
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{ mt: "10px" }}
      >
        <MenuItem data-value="schedule" onClick={handleCreateNode}>
          Schedule
        </MenuItem>
        <Divider />
        <MenuItem data-value="extractApi" onClick={handleCreateNode}>
          Extract API
        </MenuItem>
        <MenuItem data-value="extractPsql" onClick={handleCreateNode}>
          Extract PostgreSQL
        </MenuItem>
        <MenuItem data-value="extractMongo" onClick={handleCreateNode}>
          Extract MongoDB
        </MenuItem>
        <Divider />
        <MenuItem data-value="transform" onClick={handleCreateNode}>
          Transform
        </MenuItem>
        <MenuItem data-value="load" onClick={handleCreateNode}>
          Load
        </MenuItem>
      </Menu>
    </div>
  );
};

export default NodeCreationMenu;
