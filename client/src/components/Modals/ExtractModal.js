import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";

const ExtractModal = ({ nodeObj, handleSubmit, disabled, handleDelete }) => {
  const [name, setName] = useState(nodeObj.data.label);
  const [url, setURL] = useState(nodeObj.data.url);
  const [actionType, setActionType] = useState(nodeObj.data.httpVerb);
  const [jsonBody, setJsonBody] = useState(
    JSON.stringify(nodeObj.data.jsonBody)
  );
  const [bodyChecked, setBodyChecked] = useState(!!nodeObj.data.bodyChecked);
  const [header, setHeader] = useState(JSON.stringify(nodeObj.data.header));
  const [headerChecked, setHeaderChecked] = useState(
    !!nodeObj.data.headerChecked
  );
  const [oAuthChecked, setOAuthChecked] = useState(!!nodeObj.data.bodyChecked);
  const [accessTokenURL, setAccessTokenURL] = useState(
    nodeObj.data.accessTokenURL
  );
  const [clientID, setClientID] = useState(nodeObj.data.clientID);
  const [clientSecret, setClientSecret] = useState(nodeObj.data.clientSecret);
  const [scope, setScope] = useState(nodeObj.data.scope);
  const [error] = useState(nodeObj.data.error);

  const formsPopulated = () => {
    return name && url && actionType; // do we need json populated too?
  };

  const handleHeaderChange = React.useCallback((value, viewupdate) => {
    setHeader(value);
  }, []);

  const handleBodyChange = React.useCallback((value, viewupdate) => {
    setJsonBody(value);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newData = {
      prev: nodeObj.data.prev,
      label: name,
      url: url,
      jsonBody: jsonBody ? JSON.parse(jsonBody) : {},
      bodyChecked: bodyChecked,
      header: header ? JSON.parse(header) : {},
      headerChecked: headerChecked,
      httpVerb: actionType,
      oAuthChecked: oAuthChecked,
      accessTokenURL: accessTokenURL,
      clientID: clientID,
      clientSecret: clientSecret,
      scope: scope,
      output: "",
    };
    handleSubmit(e, newData);
  };

  return (
    <Box>
      <form onSubmit={handleFormSubmit}>
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
          disabled={disabled ? true : false}
          id="outlined-basic"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
        />
        <FormControl>
          <InputLabel id="action-type">Action Type</InputLabel>
          <Select
            disabled={disabled ? true : false}
            labelId="action-type"
            id="action-type-select"
            value={actionType}
            label="Action Type"
            onChange={(e) => setActionType(e.target.value)}
            size="small"
          >
            <MenuItem value={"GET"}>GET</MenuItem>
            <MenuItem value={"POST"}>POST</MenuItem>
          </Select>
        </FormControl>
        <br></br>
        <br></br>
        <TextField
          disabled={disabled ? true : false}
          id="outlined-basic"
          label="URL"
          value={url}
          onChange={(e) => setURL(e.target.value)}
          size="small"
        />
        <br></br>
        <br></br>
        <FormGroup sx={{ alignItems: "flex-start" }}>
          <FormControlLabel
            control={
              <Switch
                checked={oAuthChecked}
                onChange={(e) => {
                  setOAuthChecked(e.target.checked);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            sx={{ m: 0 }}
            label="OAuth2"
            defaultChecked
            labelPlacement="end"
          />
        </FormGroup>
        {oAuthChecked ? (
          <Box>
            <p>Client Credentials Grant Type (token send through header)</p>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Box>
                <TextField
                  disabled={active ? true : false}
                  id="outlined-basic"
                  label="Access Token URL"
                  value={accessTokenURL}
                  onChange={(e) => setAccessTokenURL(e.target.value)}
                  size="small"
                  sx={{ width: "100%" }}
                />
              </Box>
              <Box>
                <TextField
                  disabled={active ? true : false}
                  id="outlined-basic"
                  label="Client ID"
                  value={clientID}
                  onChange={(e) => setClientID(e.target.value)}
                  size="small"
                  sx={{ width: "100%" }}
                />
              </Box>
              <Box>
                <TextField
                  disabled={active ? true : false}
                  id="outlined-basic"
                  label="Client Secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  size="small"
                  sx={{ width: "100%" }}
                />
              </Box>
              <Box>
                <TextField
                  disabled={active ? true : false}
                  id="outlined-basic"
                  label="Scope"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  size="small"
                  sx={{ width: "100%" }}
                />
              </Box>
            </Box>
          </Box>
        ) : null}
        <FormGroup sx={{ alignItems: "flex-start" }}>
          <FormControlLabel
            control={
              <Switch
                checked={headerChecked}
                onChange={(e) => {
                  setHeaderChecked(e.target.checked);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            sx={{ m: 0 }}
            label="Header"
            defaultChecked
            labelPlacement="end"
          />
        </FormGroup>
        {headerChecked ? (
          <CodeMirror
            readOnly={active ? true : false}
            value={header}
            height="200px"
            extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
            onChange={handleHeaderChange}
          />
        ) : null}

        <FormGroup sx={{ alignItems: "flex-start" }}>
          <FormControlLabel
            control={
              <Switch
                checked={bodyChecked}
                onChange={(e) => {
                  setBodyChecked(e.target.checked);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            sx={{ m: 0 }}
            label="Body"
            defaultChecked
            labelPlacement="end"
          />
        </FormGroup>
        {bodyChecked ? (
          <CodeMirror
            readOnly={active ? true : false}
            value={jsonBody}
            height="200px"
            extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
            onChange={handleBodyChange}
          />
        ) : null}

        <br></br>
        <br></br>
        <Stack direction="row">
          <Button
            variant="contained"
            color="primary"
            onClick={handleDelete}
            disabled={disabled ? true : false}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={disabled || !formsPopulated() ? true : false}
          >
            Save and Execute
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ExtractModal;
