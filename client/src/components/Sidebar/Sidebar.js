import React from "react";
import ExecutionLogs from "./ExecutionLogs";
import EditWorkflow from "./EditWorkflow";
import MetricsModal from "../Modals/MetricsModal.js";
import { Box, Button, Divider, Modal } from "@mui/material";
import { getExecutions } from "../../services/api";

const Sidebar = ({
  workflowID,
  handleExecutionListItemClick,
  handleEditWorkflowListItemClick,
  active,
}) => {
  const [selectedEditIndex, setSelectedEditIndex] = React.useState(0);
  const [selectedTestIndex, setSelectedTestIndex] = React.useState(null);
  const [selectedActiveIndex, setSelectedActiveIndex] = React.useState(null);
  const [metricsModalOpen, setMetricsModalOpen] = React.useState(false);
  const [testExecutions, setTestExecutions] = React.useState([]);
  const [activeExecutions, setActiveExecutions] = React.useState([]);

  React.useEffect(() => {
    let executionSource;
    const getLogs = async () => {
      // const executions = await getExecutions(workflowID);
      executionSource = new EventSource(
        `http://localhost:3001/executions/${workflowID}`
      );

      executionSource.onmessage = (event) => {
        const test = [];
        const active = [];
        let executions = JSON.parse(event.data);
        if (!Array.isArray(executions) && typeof executions === "object") {
          executions = [executions];
        }

        if (executions) {
          executions
            .sort((a, b) => b.start_time.localeCompare(a.start_time))
            .forEach((execution) => {
              if (execution.workflow.active) {
                active.push(execution);
              } else {
                test.push(execution);
              }
            });
        }

        setTestExecutions((prev) => test.concat(prev));
        setActiveExecutions((prev) => active.concat(prev));
      };
    };
    getLogs();
    return () => {
      console.log("close SSE connection");
      executionSource.close();
    };
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

  const handleMetricsButtonClick = (event) => {
    event.preventDefault();
    setMetricsModalOpen(true);
  };

  const handleCloseMetricsModal = (e) => {
    e.preventDefault();
    setMetricsModalOpen(false);
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
        active={active}
      />
      <Button
        className="MuiListItemButton-root MuiTypography-root"
        onClick={handleMetricsButtonClick}
        sx={{
          backgroundColor: "rgba(25, 118, 210, 0.08)",
          width: 250,
          height: 45,
          color: "#000000",
        }}
      >
        Active Metrics
      </Button>
      {metricsModalOpen ? (
        <MetricsModal
          metricsModalOpen={metricsModalOpen}
          handleCloseMetricsModal={handleCloseMetricsModal}
          workflowID={workflowID}
        />
      ) : null}
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
