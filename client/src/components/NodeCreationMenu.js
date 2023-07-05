import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

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

const NodeCreationMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleCreateNode = (event) => {
    const nodeType = event.target.dataset.value;
    props.onCreateNode(nodeType);	
    handleClose();
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        CREATE NODE
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem data-value="trigger" onClick={handleCreateNode}>Schedule</MenuItem>
        <MenuItem data-value="extract" onClick={handleCreateNode}>Extract</MenuItem>
        <MenuItem data-value="transform" onClick={handleCreateNode}>Transform</MenuItem>
        <MenuItem data-value="load" onClick={handleCreateNode}>Load</MenuItem>		
      </Menu>
    </div>
  );
}

export default NodeCreationMenu;