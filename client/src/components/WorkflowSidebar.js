import React from "react";
import { Box } from "@mui/material";

const WorkflowSidebar = () => {
  return (
    <Box
      data-name="sidebar"
      sx={{
        width: 250,
        height: "calc(100vh - 160px)",
        borderRight: "2px solid #E4E4E4",
        padding: "24px",
      }}
    >
      sidebar content
    </Box>
  );
};

export default WorkflowSidebar;
