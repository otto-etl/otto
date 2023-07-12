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
import { Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { Trash2 } from "lucide-react";

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

  const formsPopulated = () => {
    return name && url && actionType; // do we need json populated too?
  };

  return (
    <Box>
      <Typography sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}>
        Extract Details
      </Typography>

      {/* <Box sx={{ height: "100%", padding: "20px", boxSizing: "border-box" }}> */}

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
        // style={{ display: "flex", flexDirection: "column", gap: "25px" }}
        style={{
          padding: "0 20px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // gap: "30px",
          height: "calc(100vh - 155px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            overflow: "scroll",
          }}
        >
          {error ? (
            <Alert
              sx={{
                // margin: "10px 0 10px 0",
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
          <Box>
            <TextField
              disabled={active ? true : false}
              id="outlined-basic"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ width: "100%", marginTop: "5px" }}
              size={"small"}
            />
          </Box>

          <Box>
            <FormControl sx={{ width: "40%" }} size={"small"}>
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
          </Box>

          <Box>
            <TextField
              disabled={active ? true : false}
              id="outlined-basic"
              label="URL"
              value={url}
              onChange={(e) => setURL(e.target.value)}
              sx={{ width: "100%" }}
              size={"small"}
            />
          </Box>
          <Box>
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
          </Box>
        </Box>
        <Stack
          direction="row"
          sx={{
            paddingTop: "30px",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            aria-label="delete"
            onClick={handleDelete}
            disabled={active ? true : false}
          >
            <Trash2 color="#555" size={26} strokeWidth={1.5} />
            {/* // #d32f2f */}
          </IconButton>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={active || !formsPopulated() ? true : false}
          >
            Save and Execute
          </Button>
        </Stack>
      </form>
      {/* </Box> */}
    </Box>
  );
};

export default ExtractModal;
