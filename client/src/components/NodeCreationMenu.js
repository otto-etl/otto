import React from "react";
import { Divider, Menu, MenuItem, Button } from "@mui/material";
import { Plus } from "lucide-react";

const NodeCreationMenu = ({ onCreateNode, logView, active }) => {
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
    onCreateNode(nodeType);
    handleClose();
  };

  return logView || active ? null : (
    <div>
      <Button
        variant="outlined"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ textTransform: "capitalize", display: "flex", gap: "10px" }}
      >
        <Plus size={18} />
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
