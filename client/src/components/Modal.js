import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import ScheduleModal from "./Modals/ScheduleModal";

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1400,
  height: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function BasicModal({ modalIsOpen, handleOpen, handleClose, nodeObj }) {
  // const [open, setOpen] = useState(modalIsOpen);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  console.log(nodeObj);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={modalIsOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle}>
          <Stack direction="row">
            <Container maxWidth="sm">
              <p>Input</p>
              <Box sx={{ bgcolor: "#cfe8fc" }}>
                {/* {JSON.stringify(nodeObj.data.input)} */}
              </Box>
            </Container>
            <Container maxWidth="sm">
              <p>Details</p>

              {nodeObj.type === "trigger" ? <ScheduleModal /> : null}
            </Container>
            <Container maxWidth="sm">
              <p>Output</p>
              <Box sx={{ bgcolor: "#cfe8fc" }}>
                {/* {nodeObj.data.output
                  ? JSON.stringify(nodeObj.data.output)
                  : null} */}
              </Box>
            </Container>
          </Stack>

          {/* <p>{JSON.stringify(nodeObj)}</p> */}
        </Box>
      </Modal>
    </div>
  );
}

export default BasicModal;
