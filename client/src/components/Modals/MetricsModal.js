import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CheckCircle2, Hourglass, Play } from "lucide-react";
import { getMetrics } from "../../services/api";

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 825,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #222",
  boxShadow: 24,
  p: 4,
};

const containerStyle = {
  alignItems: "center",
  border: "1px solid #CCC",
  display: "flex",
  height: 80,
  justifyContent: "center",
  margin: "0 10px 0 10px",
}

const metricHeaderStyle = {
  position: "relative",
  top: "-9px",
  fontSize: "0.85rem",
  color:"#686868"
}

const metricStyle = {
  fontSize:"1.25rem",
  fontWeight:"600"
}

const MetricsModal = ({ metricsModalOpen, handleCloseMetricsModal, workflowID }) => {
  const [totalExecutions, setTotalExecutions] = useState();
  const [successRate, setSuccessRate] = useState("");
  const [completionTime, setCompletionTime] = useState("");

  useEffect(() => {
    const getAllMetrics = async () => {
	  const metrics = await getMetrics(workflowID);
	  setTotalExecutions(metrics.total_executions);
	  setSuccessRate(`${metrics.success_rate}%`);
	  setCompletionTime(`${metrics.avg_milliseconds_to_complete_workflow} ms`);
	}
    getAllMetrics();
  }, [setTotalExecutions, setSuccessRate, setCompletionTime]);

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
			  <Box sx={{position: "relative", right: "35px", top: "-18px"}}>
			    <Play/>
			  </Box>
			  <Stack>
		        <Box sx={metricHeaderStyle}>Total Executions</Box>
				<Box sx={metricStyle}>{totalExecutions}</Box>
			  </Stack>
			</Container>
		    <Container sx={containerStyle}>
			  <Box sx={{position: "relative", right: "48px", top: "-18px"}}>
			    <CheckCircle2/>
			  </Box>
		      <Stack>
			    <Box sx={metricHeaderStyle}>Success Rate</Box>
				<Box sx={metricStyle}>{successRate}</Box>
			  </Stack>
			</Container>
		    <Container sx={containerStyle}>
			  <Box sx={{position: "relative", right: "16px", top: "-18px"}}>
			    <Hourglass/>
			  </Box>
			  <Stack>
		        <Box sx={metricHeaderStyle}>Average Completion Time</Box>
			    <Box sx={metricStyle}>{completionTime}</Box>
			  </Stack>
			</Container>
		  </Stack>
          <Typography sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}>
            Node Metrics
          </Typography>
          <Stack direction="row" sx={{ height: "100%" }}>
		  </Stack>
        </Container>
      </Box>
    </Modal>
  );
};

export default MetricsModal;
