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
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";

const ExtractModal = ({ nodeObj, handleSubmit, active, handleDelete }) => {
  const [name, setName] = useState(nodeObj.data.label);
  const [url, setURL] = useState(nodeObj.data.url);
  const [actionType, setActionType] = useState(nodeObj.data.httpVerb);
  const [jsonBody, setJsonBody] = useState(
    JSON.stringify(nodeObj.data.jsonBody)
  );
  const [header, setHeader] = useState(JSON.stringify(nodeObj.data.header));
  const [error, setError] = useState(nodeObj.data.error);

  const formsPopulated = () => {
    return name && url && actionType; // do we need json populated too?
  };

  const handleHeaderChange = React.useCallback((value, viewupdate) => {
    setHeader(value);
  }, []);

  const handleBodyChange = React.useCallback((value, viewupdate) => {
    setJsonBody(value);
  }, []);

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
            jsonBody: JSON.parse(jsonBody),
            header: JSON.parse(header),
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
        <p>Header:</p>
        <CodeMirror
          readOnly={active ? true : false}
          value={header}
          height="200px"
          extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
          onChange={handleHeaderChange}
        />
        <p>Body:</p>
        <CodeMirror
          readOnly={active ? true : false}
          value={jsonBody}
          height="200px"
          extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
          onChange={handleBodyChange}
        />
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
            disabled={active || !formsPopulated() ? true : false}
          >
            Save and Execute
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ExtractModal;
