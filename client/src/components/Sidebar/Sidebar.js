import React from "react";
import SidebarExecutionLogs from "./ExecutionLogs";
import EditWorkflow from "./EditWorkflow";
import { Box, Divider } from "@mui/material";

const WorkflowSidebar = () => {
  const [selectedCurrentIndex, setSelectedCurrentIndex] = React.useState(0);
  const [selectedTestIndex, setSelectedTestIndex] = React.useState(null);
  const [selectedActiveIndex, setSelectedActiveIndex] = React.useState(null);

  const testExecutions = [
    { primary: "23 Jun at 12:19:14", success: true },
    { primary: "23 Jun at 12:19:01", success: true },
    { primary: "22 Jun at 2:39:12", success: false },
    { primary: "15 Jun at 09:11:48", success: true },
  ];

  const activeExecutions = [{ primary: "24 Jun at 00:00:00", success: false }];

  const handleCurrentListItemClick = (event, index) => {
    setSelectedCurrentIndex(index);
    setSelectedTestIndex(null);
    setSelectedActiveIndex(null);
    console.log("UPDATE REACT FLOW STATE");
  };

  const handleTestListItemClick = (event, index) => {
    setSelectedCurrentIndex(null);
    setSelectedTestIndex(index);
    setSelectedActiveIndex(null);
    console.log("UPDATE REACT FLOW STATE");
  };

  const handleActiveListItemClick = (event, index) => {
    setSelectedCurrentIndex(null);
    setSelectedActiveIndex(index);
    setSelectedTestIndex(null);
    console.log("UPDATE REACT FLOW STATE");
  };

  return (
    <Box
      sx={{
        width: 250,
        height: "calc(100vh - 160px)",
        borderRight: "2px solid #E4E4E4",
        padding: "24px",
      }}
    >
      <EditWorkflow
        selectedCurrentIndex={selectedCurrentIndex}
        handleCurrentListItemClick={handleCurrentListItemClick}
      />
      <Divider sx={{ mb: "20px" }} />
      <SidebarExecutionLogs
        testExecutions={testExecutions}
        activeExecutions={activeExecutions}
        selectedTestIndex={selectedTestIndex}
        selectedActiveIndex={selectedActiveIndex}
        handleTestListItemClick={handleTestListItemClick}
        handleActiveListItemClick={handleActiveListItemClick}
      />
    </Box>
  );
};

export default WorkflowSidebar;
