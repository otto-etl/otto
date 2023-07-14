import React from "react";
import ExecutionLogs from "./ExecutionLogs";
import EditWorkflow from "./EditWorkflow";
import { Box, Divider } from "@mui/material";
import { getExecutions } from "../../services/api";

const Sidebar = ({
  workflowID,
  handleExecutionListItemClick,
  handleEditWorkflowListItemClick,
}) => {
  const [selectedEditIndex, setSelectedEditIndex] = React.useState(0);
  const [selectedTestIndex, setSelectedTestIndex] = React.useState(null);
  const [selectedActiveIndex, setSelectedActiveIndex] = React.useState(null);
  const [testExecutions, setTestExecutions] = React.useState([]);
  const [activeExecutions, setActiveExecutions] = React.useState([]);

  React.useEffect(() => {
    const getLogs = async () => {
      // const executions = await getExecutions(workflowID);
      const executionSource = new EventSource(
        `http://localhost:3001/executions/${workflowID}`
      );
      // console.log("executionsEvent triggered");
      const test = [];
      const active = [];
      executionSource.onmessage = (event) => {
        let executions = JSON.parse(event.data);
        // console.log("executions", executions);
        if (!Array.isArray(executions) && typeof executions === "object") {
          executions = [executions];
        }
        if (executions) {
          executions.forEach((execution) => {
            if (execution.workflow.active) {
              active.push(execution);
            } else {
              test.push(execution);
            }
          });
        }
        setTestExecutions(test);
        setActiveExecutions(active);
      };
    };

    getLogs();
  }, []);

  const handleEditListItemClick = (event, index) => {
    // Prevents function from executing when "Edit Test Workflow" is already selected.
    if (event.target.closest(".Mui-selected")) return;

    setSelectedEditIndex(index);
    setSelectedTestIndex(null);
    setSelectedActiveIndex(null);
    handleEditWorkflowListItemClick();
  };

  const handleTestListItemClick = (event, index) => {
    setSelectedEditIndex(null);
    setSelectedTestIndex(index);
    setSelectedActiveIndex(null);
    const nodes = testExecutions[index].workflow.nodes;
    const edges = testExecutions[index].workflow.edges;
    handleExecutionListItemClick(nodes, edges);
  };

  const handleActiveListItemClick = (event, index) => {
    setSelectedEditIndex(null);
    setSelectedActiveIndex(index);
    setSelectedTestIndex(null);
    const nodes = activeExecutions[index].workflow.nodes;
    const edges = activeExecutions[index].workflow.edges;
    handleExecutionListItemClick(nodes, edges);
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
        selectedEditIndex={selectedEditIndex}
        handleEditListItemClick={handleEditListItemClick}
      />
      <Divider sx={{ mb: "20px" }} />
      <ExecutionLogs
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

export default Sidebar;
