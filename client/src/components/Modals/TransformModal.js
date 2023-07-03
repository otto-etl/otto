import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const TransfromModal = ({ nodeObj, handleSubmit }) => {
  const [name, setName] = useState(nodeObj.data.label);
  const [dateAndTime, setDateAndTime] = useState(dayjs(nodeObj.data.startTime));
  const [interval, setInterval] = useState(
    nodeObj.data.intervalInMinutes / 24 / 60
  );

  console.log("Schedule modal");

  return (
    <Box>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          const newData = {
            label: name,
            startTime: dateAndTime.$d,
            intervalInMinutes: Number(interval) * 24 * 60,
          };
          console.log(newData);
          handleSubmit(e, newData);
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
          label="Interval in Days"
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

export default TransfromModal;
