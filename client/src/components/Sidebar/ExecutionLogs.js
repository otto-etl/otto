import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Tab,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const ExecutionLogs = ({
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
      const dateTime = execution.start_time.split("T");
      const date = dateTime[0];
      const time = dateTime[1].split(".")[0];

      return (
        <ListItemButton
          key={execution.id}
          selected={selectedTestIndex === index}
          onClick={(event) => handleTestListItemClick(event, index)}
          sx={{ gap: "12px" }}
        >
          {execution.successful ? (
            <CheckCircle2 size={20} strokeWidth={2} color="#247c44" />
          ) : (
            <AlertTriangle size={20} strokeWidth={2} color="#902b2b" />
          )}
          <ListItemText primary={date} secondary={time} />
        </ListItemButton>
      );
    });
  };

  const activeExecutionListItems = (activeExecutions) => {
    return activeExecutions.map((execution, index) => {
      const dateTime = execution.start_time.split("T");
      const date = dateTime[0];
      const time = dateTime[1].split(".")[0];

      return (
        <ListItemButton
          key={execution.id}
          selected={selectedActiveIndex === index}
          onClick={(event) => handleActiveListItemClick(event, index)}
          sx={{ gap: "12px" }}
        >
          {execution.successful ? (
            <CheckCircle2 size={20} strokeWidth={2} color="#247c44" />
          ) : (
            <AlertTriangle size={20} strokeWidth={2} color="#902b2b" />
          )}
          <ListItemText primary={date} secondary={time} />
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
        <TabPanel
          value="1"
          sx={{ p: 0, height: "calc(100vh - 337px)", overflow: "auto" }}
        >
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
        <TabPanel
          value="2"
          sx={{ p: 0, height: "calc(100vh - 329px)", overflow: "auto" }}
        >
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

export default ExecutionLogs;
