import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const ScheduleModal = () => {
  const [name, setName] = useState("");
  const [dateAndTime, setDateAndTime] = useState(dayjs("2022-04-17T15:30"));
  const [interval, setInterval] = useState("");

  console.log("Schedule modal");

  return (
    <Box>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          console.log(name, dateAndTime);

          console.log("Submitted!");
        }}
      >
        <TextField
          id="outlined-basic"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} // variant="outlined"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
            <DateTimePicker
              label="Controlled picker"
              value={dateAndTime}
              onChange={(dateAndTime) => setDateAndTime(dateAndTime)}
            />
          </DemoContainer>
        </LocalizationProvider>
        <TextField
          id="outlined-basic"
          label="Interval"
          type={"number"}
          value={interval}
          onChange={(e) => setInterval(e.target.value)} // variant="outlined"
        />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default ScheduleModal;
