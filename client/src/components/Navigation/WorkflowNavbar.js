import React from "react";
import {
  AppBar,
  Box,
  Button,
  Typography,
  FormControlLabel,
  FormGroup,
  Switch,
  Toolbar,
} from "@mui/material";

const WorkflowNavbar = ({
  wfName,
  message,
  active,
  handleSaveWorkflow,
  handleExecuteAll,
  handleToggleActive,
}) => {
  return (
    <AppBar
      position={"static"}
      sx={{
        boxShadow: "none",
        borderBottom: "2px solid #E4E4E4",
        color: "#222",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#FFF",
          boxShadow: "none",
        }}
      >
        <Typography variant="h6" component="h1" sx={{ m: 0, color: "#222" }}>
          {wfName}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <Typography>{message}</Typography>
          <Button
            variant="outlined"
            disabled={active ? true : false}
            onClick={handleSaveWorkflow}
          >
            Save
          </Button>
          <Button variant="contained" onClick={handleExecuteAll}>
            Execute Workflow
          </Button>
          <FormGroup sx={{ marginRight: "-10px" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={active}
                  onChange={handleToggleActive}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              sx={{ m: 0 }}
              label="Active"
              defaultChecked
              labelPlacement="start"
            />
          </FormGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default WorkflowNavbar;
