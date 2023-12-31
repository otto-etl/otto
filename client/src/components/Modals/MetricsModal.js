import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CheckCircle2, Hourglass, Play } from "lucide-react";
import NodeMetric from "./NodeMetric";

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  minHeight: "515px",
  maxHeight: "90%",
  backgroundColor: "#EDEEF0",
  border: "1px solid #E4E4E4",
  boxShadow: 24,
  p: 4,
  overflowY: "scroll",
  boxSizing: "border-box",
};

const containerStyle = {
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  border: "1px solid #CCC",
  display: "flex",
  height: 80,
  justifyContent: "center",
  margin: "0 0 0 10px",
  paddingTop: "10px",
  width: "342px",
  gap: "10px",
};

// there has to be a better way to do this
const metricHeaderStyle = {
  position: "relative",
  top: "-9px",
  left: "-40px",
  fontSize: "0.85rem",
  color: "#686868",
};

const longMetricHeaderStyle = {
  position: "relative",
  top: "-9px",
  left: "-12px",
  fontSize: "0.85rem",
  color: "#686868",
};

const metricStyle = {
  fontSize: "1.25rem",
  fontWeight: "600",
  position: "relative",
  left: "-40px",
};

const longMetricStyle = {
  fontSize: "1.25rem",
  fontWeight: "600",
  position: "relative",
  left: "-12px",
};

const MetricsModal = ({
  metrics,
  metricsModalOpen,
  handleCloseMetricsModal,
}) => {
  const [newMetrics, setNewMetrics] = useState();
  const [totalExecutions, setTotalExecutions] = useState();
  const [successRate, setSuccessRate] = useState();
  const [completionTime, setCompletionTime] = useState();
  const [nodeMetrics, setNodeMetrics] = useState();

  const parseNodeMetrics = (data) => {
    let nodes = [];
    Object.keys(data.avg_milliseconds_to_complete_node).forEach((id) => {
      let nodeData = {};
      nodeData.id = id;
      nodeData.metrics = {
        name: data.avg_milliseconds_to_complete_node[id].name,
        type: data.avg_milliseconds_to_complete_node[id].type,
        avg_time: data.avg_milliseconds_to_complete_node[id].avg_time,
      };
      nodes.push(nodeData);
    });
    Object.keys(data.avg_volume_extracted_data).forEach((id) => {
      let currentNode = nodes.find((node) => node.id === id);
      currentNode.metrics.avg_volume =
        data.avg_volume_extracted_data[id].avg_volume;
    });
    Object.keys(data.node_failure_count).forEach((id) => {
      let currentNode = nodes.find((node) => node.id === id);
      if (!currentNode) {
        // If a node has failed upon the first execution it will not be in the above JSON so we have to add it
        currentNode = {};
        currentNode.id = id;
        currentNode.metrics = {
          name: data.node_failure_count[id].name,
          type: data.node_failure_count[id].type,
          avg_time: "N/A",
          avg_volume: "N/A",
        };
      }
      currentNode.metrics.failures = data.node_failure_count[id].failures;
      nodes.push(currentNode);
    });
    return nodes;
  };

  useEffect(() => {
    metrics.then((metricData) => {
      setNewMetrics(metricData);
      setTotalExecutions(metricData.total_executions);
      setSuccessRate(
        metricData.success_rate === -1 ? "N/A" : `${metricData.success_rate}%`
      );
      setCompletionTime(
        metricData.avg_milliseconds_to_complete_workflow === -1
          ? "N/A"
          : `${metricData.avg_milliseconds_to_complete_workflow} ms`
      );
      setNodeMetrics(parseNodeMetrics(metricData));
    });
  }, [metrics]);

  if (!newMetrics) {
    return;
  }

  return (
    <Modal
      open={metricsModalOpen}
      onClose={handleCloseMetricsModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={boxStyle}>
        <Container>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: "500",
              marginLeft: "10px",
              marginBottom: "10px",
            }}
          >
            Workflow Metrics
          </Typography>
          <Stack
            direction="row"
            sx={{ height: "100%", marginBottom: "40px", gap: "12px" }}
          >
            <Box sx={containerStyle}>
              <Box sx={{ position: "relative", right: "66px", top: "-18px" }}>
                <Play />
              </Box>
              <Stack>
                <Box sx={metricHeaderStyle}>Successful Executions</Box>
                <Box sx={metricStyle}>{totalExecutions}</Box>
              </Stack>
            </Box>
            <Box sx={containerStyle}>
              <Box sx={{ position: "relative", right: "90px", top: "-18px" }}>
                <CheckCircle2 />
              </Box>
              <Stack>
                <Box sx={metricHeaderStyle}>Success Rate</Box>
                <Box sx={metricStyle}>{successRate}</Box>
              </Stack>
            </Box>
            <Box sx={containerStyle}>
              <Box sx={{ position: "relative", right: "55px", top: "-18px" }}>
                <Hourglass />
              </Box>
              <Stack>
                <Box sx={longMetricHeaderStyle}>Average Completion Time</Box>
                <Box sx={longMetricStyle}>{completionTime}</Box>
              </Stack>
            </Box>
          </Stack>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: "500",
              marginLeft: "10px",
              marginBottom: "10px",
            }}
          >
            Node Metrics
          </Typography>
          <Stack direction="column" sx={{ height: "100%" }}>
            {nodeMetrics.map((node) => {
              return (
                <NodeMetric
                  key={node.id}
                  nodeType={node.metrics.type}
                  nodeName={node.metrics.name}
                  avgTime={node.metrics.avg_time}
                  avgVolume={node.metrics.avg_volume}
                  failures={node.metrics.failures}
                />
              );
            })}
          </Stack>
        </Container>
      </Box>
    </Modal>
  );
};

export default MetricsModal;
