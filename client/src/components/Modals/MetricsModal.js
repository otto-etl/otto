import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CheckCircle2, Hourglass, Play } from "lucide-react";
import NodeMetric from "./NodeMetric";
import { getMetrics } from "../../services/api";

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-38%, -40%)",
  width: 1120,
  height: 515,
  backgroundColor: "#EDEEF0",
  border: "1px solid #E4E4E4",
  boxShadow: 24,
  p: 4,
  overflowY: "scroll",
};

const containerStyle = {
  alignItems: "center",
  backgroundColor:"#FFFFFF",
  border: "1px solid #CCC",
  display: "flex",
  height: 80,
  justifyContent: "center",
  margin: "0 10px 0 10px",
}

// there has to be a better way to do this
const metricHeaderStyle = {
  position: "relative",
  top: "-9px",
  left: "-40px",
  fontSize: "0.85rem",
  color:"#686868"
}

const longMetricHeaderStyle = {
  position: "relative",
  top: "-9px",
  left: "-12px",
  fontSize: "0.85rem",
  color:"#686868"
}

const metricStyle = {
  fontSize:"1.25rem",
  fontWeight:"600",
  position: "relative",
  left: "-40px"
}

const longMetricStyle = {
  fontSize:"1.25rem",
  fontWeight:"600",
  position: "relative",
  left: "-12px"
}

const MetricsModal = ({ metrics, metricsModalOpen, handleCloseMetricsModal, workflowID }) => {
  const [newMetrics, setNewMetrics] = useState();
  const [totalExecutions, setTotalExecutions] = useState();
  const [successRate, setSuccessRate] = useState();
  const [completionTime, setCompletionTime] = useState();
  const [nodeMetrics, setNodeMetrics] = useState();

  const parseNodeMetrics = (data) => {
	let nodes = [];
	Object.keys(data.avg_milliseconds_to_complete_node).forEach(id => {
	  let nodeData = {};
	  nodeData.id = id;
	  nodeData.metrics = {name: data.avg_milliseconds_to_complete_node[id].name, type: data.avg_milliseconds_to_complete_node[id].type, avg_time: data.avg_milliseconds_to_complete_node[id].avg_time};
	  nodes.push(nodeData);
	});
	Object.keys(data.node_failure_count).forEach(id => {
	  let currentNode = nodes.find(node => node.id === id);
      currentNode.metrics.failures = data.node_failure_count[id];	  
	});
	Object.keys(data.avg_volume_extracted_data).forEach(id => {
	  let currentNode = nodes.find(node => node.id === id);
	  currentNode.metrics.avg_volume = data.avg_volume_extracted_data[id].avg_volume;
	});
    return nodes;
  };

  useEffect(() => {
    metrics.then(metricData => {
	  setNewMetrics(metricData);
	  setTotalExecutions(metricData.total_executions);
	  setSuccessRate(`${metricData.success_rate}%`);
	  setCompletionTime(`${metricData.avg_milliseconds_to_complete_workflow} ms`);
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
          <Typography sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}>
            Workflow Metrics
          </Typography>
          <Stack direction="row" sx={{ height: "100%" }}>
		    <Container sx={containerStyle}>
			  <Box sx={{position: "relative", right: "85px", top: "-18px"}}>
			    <Play/>
			  </Box>
			  <Stack>
		        <Box sx={metricHeaderStyle}>Total Executions</Box>
				<Box sx={metricStyle}>{totalExecutions}</Box>
			  </Stack>
			</Container>
		    <Container sx={containerStyle}>
			  <Box sx={{position: "relative", right: "90px", top: "-18px"}}>
			    <CheckCircle2/>
			  </Box>
		      <Stack>
			    <Box sx={metricHeaderStyle}>Success Rate</Box>
				<Box sx={metricStyle}>{successRate}</Box>
			  </Stack>
			</Container>
		    <Container sx={containerStyle}>
			  <Box sx={{position: "relative", right: "55px", top: "-18px"}}>
			    <Hourglass/>
			  </Box>
			  <Stack>
		        <Box sx={longMetricHeaderStyle}>Average Completion Time</Box>
			    <Box sx={longMetricStyle}>{completionTime}</Box>
			  </Stack>
			</Container>
		  </Stack>
          <Typography sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}>
            Node Metrics
          </Typography>
          <Stack direction="column" sx={{ height: "100%" }}>
		    {nodeMetrics.map(node => {
			  return <NodeMetric key={node.id} nodeType={node.metrics.type} nodeName={node.metrics.name} avgTime={node.metrics.avg_time} avgVolume={node.metrics.avg_volume} failures={node.metrics.failures} />
			})}
		  </Stack>
        </Container>
      </Box>
    </Modal>
  );
};

export default MetricsModal;
