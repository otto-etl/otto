import React, { useState, useCallback } from "react";
import {
  Alert,
  AlertTitle,
  Typography,
  IconButton,
  Box,
  Stack,
  Button,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";

const ExtractMongoModal = ({
  nodeObj,
  handleSubmit,
  disabled,
  handleDelete,
}) => {
  const [name, setName] = useState(nodeObj.data.label);
  const [host, setHost] = useState(nodeObj.data.host);
  const [port, setPort] = useState(nodeObj.data.port);
  const [defaultDatabase, setDefaultDatabase] = useState(
    nodeObj.data.defaultDatabase
  );
  const [collection, setCollection] = useState(nodeObj.data.collection);
  const [username, setUsername] = useState(nodeObj.data.username);
  const [password, setPassword] = useState(nodeObj.data.password);
  const [query, setQuery] = useState(nodeObj.data.query);
  const [limit, setLimit] = useState(nodeObj.data.limit);
  // const [connectionFormat, setConnectionFormat] = useState(
  //   nodeObj.data.connectionFormat
  // );
  const [connectionFormat, setConnectionFormat] = useState(
    nodeObj.data.connectionFormat
  );

  const handleConnectionFormatChange = (event) => {
    setConnectionFormat(event.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const mongoData = {
      label: name,
      host,
      port,
      defaultDatabase,
      collection,
      username,
      password,
      query,
      limit,
      connectionFormat,
    };

    handleSubmit(e, mongoData);
  };

  const handleQueryChange = useCallback((query) => {
    setQuery(query);
  }, []);

  return (
    <Box>
      <Box>
        <Typography
          sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}
        >
          Extract Mongodb Details
        </Typography>
      </Box>
      <form
        onSubmit={handleFormSubmit}
        style={{
          padding: "0 20px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "calc(100vh - 155px)",
        }}
      >
        {nodeObj.data.error ? (
          <Alert
            sx={{
              // margin: "10px 0 10px 0",
              border: "2px solid #B99",
              whiteSpace: "pre-line",
              marginBottom: "20px",
            }}
            severity="error"
          >
            <AlertTitle sx={{ fontWeight: "700", color: "#200" }}>
              {nodeObj.data.error.errName === "ExternalError"
                ? "External Error:"
                : "Internal Error:"}
            </AlertTitle>
            <p>{nodeObj.data.error.message}</p>
          </Alert>
        ) : null}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            overflow: "scroll",
          }}
        >
          <TextField
            disabled={disabled ? true : false}
            id="outlined-basic"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // sx={{ width: "100%", marginTop: "5px" }}
            size={"small"}
            sx={{ marginTop: "5px" }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
              Credentials
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
              }}
            >
              <TextField
                disabled={disabled ? true : false}
                id="outlined-basic"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // sx={{ width: "100%", marginTop: "5px" }}
                size={"small"}
              />
              <TextField
                disabled={disabled ? true : false}
                id="outlined-basic"
                label="Password"
                // TURN TO PASSWORD BEFORE END OF PROJECT
                // type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // sx={{ width: "100%", marginTop: "5px" }}
                size={"small"}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
              Connection Details
            </Typography>
            <TextField
              disabled={disabled ? true : false}
              id="outlined-basic"
              label="Host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              // sx={{ width: "100%", marginTop: "5px" }}
              size={"small"}
            />
          </Box>
          <Box>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Connection Format
              </FormLabel>
              <RadioGroup
                sx={{ flexDirection: "row" }}
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={connectionFormat}
                onChange={handleConnectionFormatChange}
              >
                <FormControlLabel
                  value="Standard"
                  control={<Radio />}
                  label="Standard (mongodb)"
                  sx={{
                    "& .MuiRadio-root": {
                      padding: "4px 9px",
                    },
                  }}
                  componentsProps={{ typography: { fontSize: "14px" } }}
                />
                <FormControlLabel
                  value="DNSSeedList"
                  control={<Radio />}
                  label="DNS seed list (mongodb+srv)"
                  componentsProps={{ typography: { fontSize: "14px" } }}
                  sx={{
                    "& .MuiRadio-root": {
                      padding: "4px 9px",
                    },
                  }}
                />
              </RadioGroup>
            </FormControl>
            {connectionFormat === "Standard" ? (
              <TextField
                disabled={disabled ? true : false}
                id="outlined-basic"
                label="Port"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                sx={{ marginTop: "10px", display: "block", width: "50%" }}
                size={"small"}
              />
            ) : null}
          </Box>
          <TextField
            disabled={disabled ? true : false}
            id="outlined-basic"
            label="Database"
            value={defaultDatabase}
            sx={{ marginTop: "5px" }}
            onChange={(e) => setDefaultDatabase(e.target.value)}
            // sx={{ width: "100%", marginTop: "5px" }}
            size={"small"}
          />
          <TextField
            disabled={disabled ? true : false}
            id="outlined-basic"
            label="Collection"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            // sx={{ width: "100%", marginTop: "5px" }}
            size={"small"}
          />

          <Box>
            <Typography sx={{ color: "#00000099", marginBottom: "10px" }}>
              Query
            </Typography>
            <CodeMirror
              readOnly={disabled ? true : false}
              value={query}
              height="200px"
              extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
              onChange={handleQueryChange}
            />
          </Box>
          <TextField
            disabled={disabled ? true : false}
            id="outlined-basic"
            label="Limit"
            value={limit}
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            onChange={(e) => setLimit(e.target.value)}
            // sx={{ width: "100%", marginTop: "5px" }}
            size={"small"}
          />
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
            disabled={disabled ? true : false}
          >
            <Trash2 color="#555" size={26} strokeWidth={1.5} />
            {/* // #d32f2f */}
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            // disabled={disabled || !formsPopulated() ? true : false}
          >
            Save and Execute
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ExtractMongoModal;
