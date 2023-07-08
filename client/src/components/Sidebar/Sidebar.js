import React from "react";
import SidebarExecutionLogs from "./ExecutionLogs";
import EditWorkflow from "./EditWorkflow";
import { Box, Divider } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
// import { CheckCircle2 } from "lucide-react";

const WorkflowSidebar = () => {
  const [selectedCurrentIndex, setSelectedCurrentIndex] = React.useState(0);
  const [selectedTestIndex, setSelectedTestIndex] = React.useState(null);
  const [selectedActiveIndex, setSelectedActiveIndex] = React.useState(null);

  const testExecutions = [
    { primary: "23 Jun at 12:19:14" },
    { primary: "23 Jun at 12:19:01" },
    { primary: "22 Jun at 2:39:12" },
    { primary: "15 Jun at 09:11:48" },
  ];

  const activeExecutions = [{ primary: "24 Jun at 00:00:00" }];

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
      {/* <CheckCircle2
        size={32}
        color="#cf1717"
        strokeWidth={2.25}
        absoluteStrokeWidth
      /> */}
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
