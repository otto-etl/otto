import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled } from "@mui/system";

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
    width: 320px;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[500] : blue[200]
      };
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const ExtractModal = ({ nodeObj, handleSubmit, active, handleDelete }) => {
  const [name, setName] = useState(nodeObj.data.label);
  const [url, setURL] = useState(nodeObj.data.url);
  const [actionType, setActionType] = useState(nodeObj.data.httpVerb);
  const [json, setJSON] = useState(nodeObj.data.json);
  const [error, setError] = useState(nodeObj.data.error);

  return (
    <Box>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          const newData = {
            prev: nodeObj.data.prev,
            label: name,
            url: url,
            json: json,
            httpVerb: actionType,
            output: "",
          };
          handleSubmit(e, newData);
        }}
      >
        <p>Extract Details</p>
        {error ? (
          <Alert
            sx={{
              margin: "10px 0 10px 0",
              border: "2px solid #B99",
              whiteSpace: "pre-line",
            }}
            severity="error"
          >
            <AlertTitle sx={{ fontWeight: "700", color: "#200" }}>
              {error.errName === "ExternalError"
                ? "External Error:"
                : "Internal Error:"}
            </AlertTitle>
            <p>{error.message}</p>
          </Alert>
        ) : null}
        <TextField
          disabled={active ? true : false}
          id="outlined-basic"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FormControl>
          <InputLabel id="action-type">Action Type</InputLabel>
          <Select
            disabled={active ? true : false}
            labelId="action-type"
            id="action-type-select"
            value={actionType}
            label="Action Type"
            onChange={(e) => setActionType(e.target.value)}
          >
            <MenuItem value={"GET"}>GET</MenuItem>
            <MenuItem value={"POST"}>POST</MenuItem>
          </Select>
        </FormControl>
        <br></br>
        <br></br>
        <TextField
          disabled={active ? true : false}
          id="outlined-basic"
          label="URL"
          value={url}
          onChange={(e) => setURL(e.target.value)}
        />
        <br></br>
        <br></br>
        <FormControl>
          <StyledTextarea
            disabled={active ? true : false}
            aria-label="json"
            minRows={5}
            placeholder="JSON"
            value={json}
            onChange={(e) => {
              setJSON(e.target.value);
            }}
          />
        </FormControl>
        <br></br>
        <br></br>
        <Stack direction="row">
          <Button
            variant="contained"
            color="primary"
            onClick={handleDelete}
            disabled={active ? true : false}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={active ? true : false}
          >
            Save and Execute
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ExtractModal;
