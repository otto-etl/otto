import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Modal,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import ScheduleModal from "./ScheduleModal";
import ExtractAPIModal from "./ExtractAPIModal";
import ExtractMongoModal from "./ExtractMongoModal";
import ExtractPsqlModal from "./ExtractPsqlModal";
import TransformModal from "./TransformModal";
import LoadModal from "./LoadModal";
import CustomTabPanel from "../CustomTabPanel";
import { X } from "lucide-react";

const TRUNCATE_LENGTH = 51;

function BasicModal({
  modalIsOpen,
  handleOpen,
  handleClose,
  nodeObj,
  onSaveExecute,
  onDeleteNode,
  runExecution,
  disabled,
  getPrevNodesOutput,
  getPrevNodeOutput,
  error,
}) {
  const [input, setInput] = useState({});
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (nodeObj.type === "transform" || nodeObj.type === "load") {
      setInput(getPrevNodesOutput(nodeObj.id));
    } else {
      setInput({});
    }
  }, [getPrevNodeOutput, getPrevNodesOutput, nodeObj]);

  // REFACTOR handleSaveExecute and handleSaveNode
  const handleSaveExecuteNode = (event, formValues) => {
    event.preventDefault();
    handleSaveNode(formValues);
  };

  const handleSaveNode = (formValues) => {
    onSaveExecute(nodeObj.id, formValues);
  };

  const handleDelete = (event) => {
    event.preventDefault();
    onDeleteNode(nodeObj.id);
    handleClose();
  };

  const a11yProps = (key) => {
    return {
      id: `simple-tab-${key}`,
      "aria-controls": `simple-tabpanel-${key}`,
    };
  };

  const handleTabChange = React.useCallback((e, newValue) => {
    setTab(newValue);
  }, []);

  const truncateNodeInputOutputData = (data, truncateLength) => {
    if (Array.isArray(data)) {
      return data.slice(0, truncateLength);
    } else {
      return data;
    }
  };

  return (
    <div>
      <Modal
        open={modalIsOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: 900,
              sm: 1200,
              md: 1500,
              lg: 1800,
              xl: 2100,
            },
            bgcolor: "background.paper",
            boxShadow: 24,
            boxSizing: "border-box",
            overflowY: "scroll",
          }}
        >
          <IconButton
            aria-label="delete"
            sx={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={handleClose}
          >
            <X color="#555" size={26} strokeWidth={1.5} />
          </IconButton>
          <Stack direction="row" sx={{ height: "100%" }}>
            {/* LEFT COLUMN */}

            <Box
              sx={{
                flex: 1,
                padding: 0,
                backgroundColor: "#f3f4f6",
                borderRight: "1px solid #E4E4E4",
              }}
            >
              <Typography
                sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}
              >
                Input
              </Typography>
              {nodeObj.type === "schedule" ||
              nodeObj.type.slice(0, 7) === "extract" ? (
                <div>
                  <Typography sx={{ marginLeft: "20px", color: "#555" }}>
                    No input
                  </Typography>
                </div>
              ) : null}
              {nodeObj.type === "transform" || nodeObj.type === "load" ? (
                <Box
                  sx={{
                    margin: "0 20px",
                  }}
                >
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      maxWidth: {
                        xs: 300,
                        sm: 359,
                        md: 459,
                        lg: 559,
                        xl: 659,
                      },
                    }}
                  >
                    <Tabs
                      value={tab}
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="basic tabs example"
                    >
                      {Object.keys(input).map((key) => {
                        // console.log(key);
                        return (
                          <Tab
                            sx={{
                              textTransform: "none",
                            }}
                            label={input[key].label}
                            {...a11yProps(Number(key))}
                          />
                        );
                      })}
                    </Tabs>
                  </Box>
                  {Object.keys(input).map((key) => {
                    return (
                      <CustomTabPanel
                        value={tab}
                        index={Number(key)}
                        scrollOffset={"236px"}
                      >
                        <JsonView
                          src={truncateNodeInputOutputData(
                            input[key].data,
                            TRUNCATE_LENGTH
                          )}
                          collapseObjectsAfterLength={100}
                        />
                      </CustomTabPanel>
                    );
                  })}
                </Box>
              ) : null}
            </Box>
            {/* CENTER COLUMN */}
            <Box sx={{ flex: 1 }}>
              {nodeObj.type === "schedule" ? (
                <ScheduleModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
                  handleDelete={handleDelete}
                  disabled={disabled}
                  handleClose={handleClose}
                />
              ) : null}
              {nodeObj.type === "extractApi" ? (
                <ExtractAPIModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
                  handleDelete={handleDelete}
                  disabled={disabled}
                  handleClose={handleClose}
                  error={error}
                />
              ) : null}
              {nodeObj.type === "extractMongo" ? (
                <ExtractMongoModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
                  handleDelete={handleDelete}
                  disabled={disabled}
                  handleClose={handleClose}
                  error={error}
                />
              ) : null}
              {nodeObj.type === "extractPsql" ? (
                <ExtractPsqlModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
                  handleDelete={handleDelete}
                  disabled={disabled}
                  handleClose={handleClose}
                  error={error}
                />
              ) : null}
              {nodeObj.type === "transform" ? (
                <TransformModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
                  handleDelete={handleDelete}
                  disabled={disabled}
                  handleClose={handleClose}
                  error={error}
                />
              ) : null}
              {nodeObj.type === "load" ? (
                <LoadModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
                  handleDelete={handleDelete}
                  disabled={disabled}
                  handleClose={handleClose}
                  error={error}
                />
              ) : null}
            </Box>
            {/* RIGHT COLUMN */}
            <Box
              sx={{
                flex: 1,
                padding: 0,
                backgroundColor: "#f3f4f6",
                borderLeft: "1px solid #E4E4E4",
              }}
            >
              <Typography
                sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}
              >
                Output
              </Typography>
              <Box
                sx={{
                  height: "calc(100vh - 159px)",
                  overflow: "auto",
                  margin: "0 20px 24px",
                }}
              >
                {Object.keys(nodeObj.data.output).length > 0 ? (
                  <JsonView
                    src={truncateNodeInputOutputData(
                      nodeObj.data.output.data,
                      TRUNCATE_LENGTH
                    )}
                    collapseObjectsAfterLength={100}
                  />
                ) : (
                  <Typography sx={{ color: "#555" }}>No output</Typography>
                )}
              </Box>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default BasicModal;
