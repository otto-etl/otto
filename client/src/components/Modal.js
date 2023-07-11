import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import ScheduleModal from "./Modals/ScheduleModal";
import ExtractModal from "./Modals/ExtractModal";
import TransformModal from "./Modals/TransformModal";
import LoadModal from "./Modals/LoadModal";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "./CustomTabPanel";
import { Typography } from "@mui/material";

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "97%",
  height: "95%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  boxSizing: "border-box",
  // p: 4,
  overflowY: "scroll",
};

function BasicModal({
  modalIsOpen,
  handleOpen,
  handleClose,
  nodeObj,
  onSaveExecute,
  onDeleteNode,
  runExecution,
  active,
  getPrevNodesOutput,
  getPrevNodeOutput,
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
  const handleSaveExecuteNode = (event, formValues) => {
    event.preventDefault();
    handleSaveNode(formValues);
    handleClose();
  };

  const handleSaveNode = (formValues) => {
    console.log(formValues);
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

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={modalIsOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: "scroll" }}
      >
        <Box sx={boxStyle}>
          <Stack direction="row" sx={{ height: "100%" }}>
            {/* LEFT COLUMN */}

            <Box sx={{ flex: 1, padding: 0, backgroundColor: "#f3f4f6" }}>
              <Typography
                sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}
              >
                Input
              </Typography>
              {nodeObj.type === "schedule" || nodeObj.type === "extract" ? (
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
                    }}
                  >
                    <Tabs
                      value={tab}
                      onChange={handleTabChange}
                      aria-label="basic tabs example"
                    >
                      {Object.keys(input).map((key) => {
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
                        <JsonView src={input[key].data} />
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
                  active={active}
                />
              ) : null}
              {nodeObj.type === "extract" ? (
                <ExtractModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
                  handleDelete={handleDelete}
                  active={active}
                />
              ) : null}
              {nodeObj.type === "transform" ? (
                <TransformModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
                  handleDelete={handleDelete}
                  active={active}
                />
              ) : null}
              {nodeObj.type === "load" ? (
                <LoadModal
                  nodeObj={nodeObj}
                  handleSubmit={handleSaveExecuteNode}
                  handleDelete={handleDelete}
                  active={active}
                />
              ) : null}
            </Box>
            {/* RIGHT COLUMN */}
            <Box sx={{ flex: 1, padding: 0, backgroundColor: "#f3f4f6" }}>
              <Typography
                sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}
              >
                Output
              </Typography>
              {nodeObj.type === "schedule" ? (
                <div>
                  <Typography sx={{ marginLeft: "20px", color: "#555" }}>
                    No output
                  </Typography>
                </div>
              ) : null}
              <Box>
                {console.log(nodeObj.data.output)}
                {console.log(Object.keys(nodeObj.data.output).length)}
                {nodeObj.data ? <JsonView src={nodeObj.data.output} /> : null}
              </Box>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default BasicModal;
