import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Typography, IconButton } from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Trash2 } from "lucide-react";

const ScheduleModal = ({ nodeObj, handleSubmit, disabled, handleDelete }) => {
  const [name, setName] = useState(nodeObj.data.label);
  const [dateAndTime, setDateAndTime] = useState(dayjs(nodeObj.data.startTime));
  const [interval, setInterval] = useState(
    nodeObj.data.intervalInMinutes / 24 / 60
  );

  const formsPopulated = () => {
    return name && dateAndTime && interval;
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Typography sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}>
        Schedule Details
      </Typography>
      <form
        style={{
          padding: "10px 20px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // gap: "30px",
          height: "calc(100% - 100px)",
        }}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <Box>
            <TextField
              disabled={disabled ? true : false}
              id="outlined-basic"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)} // variant="outlined"
              sx={{ width: "100%" }}
              size={"small"}
            />
          </Box>
          <Box>
            <Typography sx={{ m: "0 0 10px" }}>
              Provide Cron job details below:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
                <DateTimePicker
                  size={"small"}
                  disabled={disabled ? true : false}
                  label="Date and Time"
                  value={dateAndTime}
                  onChange={(dateAndTime) => setDateAndTime(dateAndTime)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          <Box>
            <TextField
              sx={{ width: "50%", marginTop: "10px", minWidth: "260px" }}
              disabled={disabled ? true : false}
              id="outlined-basic"
              label="Frequency of Execution (days)"
              type={"number"}
              value={interval}
              onChange={(e) => setInterval(e.target.value)} // variant="outlined"
              size={"small"}
            />
          </Box>
        </Box>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <IconButton
            aria-label="delete"
            onClick={handleDelete}
            disabled={disabled ? true : false}
          >
            <Trash2 color="#555" size={26} strokeWidth={1.5} />
            {/* // #d32f2f */}
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={disabled || !formsPopulated() ? true : false}
          >
            Save
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ScheduleModal;
