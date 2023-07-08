import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const ScheduleModal = ({ nodeObj, handleSubmit, active, handleDelete }) => {
  const [name, setName] = useState(nodeObj.data.label);
  const [dateAndTime, setDateAndTime] = useState(dayjs(nodeObj.data.startTime));
  const [interval, setInterval] = useState(
    nodeObj.data.intervalInMinutes / 24 / 60
  );

  const formsPopulated = () => {
    return name && dateAndTime && interval;
  }

  return (
    <Box>
      <p>Schedule Details</p>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          const newData = {
            label: name,
            startTime: dateAndTime.$d,
            intervalInMinutes: Number(interval) * 24 * 60,
          };
          handleSubmit(e, newData);
        }}
      >
        <TextField
          disabled={active ? true : false}
          id="outlined-basic"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} // variant="outlined"
        />
        <br></br>
        <br></br>
        <p>Provide Cron job details below:</p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
            <DateTimePicker
              disabled={active ? true : false}
              label="Date and Time"
              value={dateAndTime}
              onChange={(dateAndTime) => setDateAndTime(dateAndTime)}
            />
          </DemoContainer>
        </LocalizationProvider>
        <br></br>
        <br></br>
        <TextField
          sx={{ width: "50%" }}
          disabled={active ? true : false}
          id="outlined-basic"
          label="Frequency of Executions (days)"
          type={"number"}
          value={interval}
          onChange={(e) => setInterval(e.target.value)} // variant="outlined"
        />
		<Stack direction="row">
          <Button variant="contained" color="primary" onClick={handleDelete} disabled={active ? true : false}>
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={active || !formsPopulated() ? true : false}
          >
            Save
          </Button>
		</Stack>
      </form>
    </Box>
  );
};

export default ScheduleModal;
