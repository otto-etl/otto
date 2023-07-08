import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tab,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

// import InboxIcon from '@mui/icons-material/Inbox';
// import DraftsIcon from '@mui/icons-material/Drafts';

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

const EditWorkflow = ({ selectedCurrentIndex, handleCurrentListItemClick }) => {
  return (
    <List component="nav" sx={{ pt: 0, pb: "20px" }}>
      <ListItemButton
        selected={selectedCurrentIndex === 0}
        onClick={(event) => handleCurrentListItemClick(event, 0)}
      >
        <ListItemText primary="Edit Test Workflow" />
      </ListItemButton>
    </List>
  );
};

const SidebarExecutionLogs = ({
  testExecutions,
  activeExecutions,
  selectedTestIndex,
  selectedActiveIndex,
  handleTestListItemClick,
  handleActiveListItemClick,
}) => {
  const [value, setValue] = React.useState("1");

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const testExecutionListItems = (testExecutions) => {
    return testExecutions.map((execution, index) => {
      return (
        <ListItemButton
          selected={selectedTestIndex === index}
          onClick={(event) => handleTestListItemClick(event, index)}
        >
          <ListItemText primary={execution.primary} />
        </ListItemButton>
      );
    });
  };

  const activeExecutionListItems = (activeExecutions) => {
    return activeExecutions.map((execution, index) => {
      return (
        <ListItemButton
          selected={selectedActiveIndex === index}
          onClick={(event) => handleActiveListItemClick(event, index)}
        >
          <ListItemText primary={execution.primary} />
        </ListItemButton>
      );
    });
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <Typography
        variant="subtitle1"
        component={"h3"}
        sx={{
          m: "0 0 10px",
          color: "#555",
          textTransform: "uppercase",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        Execution Logs
      </Typography>
      {/* TEST EXECUTION TAB */}
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "#E4E4E4" }}>
          <TabList onChange={handleTabChange}>
            <Tab label="Test" value="1" sx={{ flex: 1 }} />
            <Tab label="Active" value="2" sx={{ flex: 1 }} />
          </TabList>
        </Box>

        {/* ACTIVE EXECUTION TAB */}
        <TabPanel value="1" sx={{ p: 0 }}>
          {testExecutions.length === 0 ? (
            <Typography
              sx={{
                color: "#555",
                padding: "20px 16px",
              }}
            >
              No test executions
            </Typography>
          ) : (
            <List component="nav">
              {testExecutionListItems(testExecutions)}
            </List>
          )}
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}>
          {activeExecutions.length === 0 ? (
            <Typography
              sx={{
                color: "#555",
                padding: "20px 16px",
              }}
            >
              No active executions
            </Typography>
          ) : (
            <List component="nav">
              {activeExecutionListItems(activeExecutions)}
            </List>
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default WorkflowSidebar;
