import React, { useState } from "react";
import {
  Typography,
  IconButton,
  Alert,
  AlertTitle,
  Box,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { sql, StandardSQL } from "@codemirror/lang-sql";
import { EditorView } from "@codemirror/view";
import { Trash2 } from "lucide-react";

const ExtractPsqlModal = ({
  nodeObj,
  handleSubmit,
  disabled,
  handleDelete,
  handleClose,
  error,
}) => {
  const [name, setName] = useState(nodeObj.data.label);
  const [code, setCode] = useState(nodeObj.data.sqlCode);
  const [userName, setUserName] = useState(nodeObj.data.userName);
  const [password, setPassword] = useState(nodeObj.data.password);
  const [host, setHost] = useState(nodeObj.data.host);
  const [port, setPort] = useState(nodeObj.data.port);
  const [dbName, setDBName] = useState(nodeObj.data.dbName);

  const handleChange = React.useCallback((value) => {
    setCode(value);
  }, []);

  const config = {
    dialect: StandardSQL,
    upperCaseKeywords: true,
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newData = {
      prev: nodeObj.data.prev,
      input: nodeObj.data.input,
      label: name,
      userName: userName,
      password: password,
      host: host,
      port: port,
      dbName: dbName,
      sqlCode: code,
    };
    handleSubmit(e, newData);
  };

  return (
    <Box>
      <Typography sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}>
        Extract Postgres Details
      </Typography>

      <form
        onSubmit={handleFormSubmit}
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
            overflow: "auto",
          }}
        >
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
          <Box>
            <TextField
              disabled={disabled ? true : false}
              id="outlined-basic"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)} // variant="outlined"
              size={"small"}
              sx={{ width: "100%", marginTop: "5px" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Credentials
            </Typography>
            <TextField
              disabled={disabled ? true : false}
              id="outlined-basic"
              label="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)} // variant="outlined"
              size={"small"}
              sx={{ marginTop: "5px" }}
            />
            <TextField
              disabled={disabled ? true : false}
              id="outlined-basic"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // variant="outlined"
              size={"small"}
            />

            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Connection Details
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <TextField
                disabled={disabled ? true : false}
                id="outlined-basic"
                label="Host"
                value={host}
                onChange={(e) => setHost(e.target.value)} // variant="outlined"
                size={"small"}
              />
              <TextField
                disabled={disabled ? true : false}
                id="outlined-basic"
                label="Port"
                value={port}
                onChange={(e) => setPort(e.target.value)} // variant="outlined"
                size={"small"}
                sx={{ width: "50%" }}
              />
              <TextField
                disabled={disabled ? true : false}
                id="outlined-basic"
                label="Database Name"
                value={dbName}
                onChange={(e) => setDBName(e.target.value)} // variant="outlined"
                size={"small"}
              />
            </Box>
          </Box>
          <Box>
            <Typography sx={{ color: "#797979", marginBottom: "10px" }}>
              Query
            </Typography>
            <Box sx={{ fontSize: "14px" }}>
              <CodeMirror
                readOnly={disabled ? true : false}
                value={code}
                height="400px"
                extensions={[sql(config), EditorView.lineWrapping]}
                onChange={handleChange}
                size={"small"}
              />
            </Box>
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
            disabled={disabled ? true : false}
          >
            <Trash2 color="#555" size={24} strokeWidth={1.5} />
            {/* // #d32f2f */}
          </IconButton>
          <Box
            sx={{
              display: "flex",
              gap: "20px",
            }}
          >
            <Button
              variant="text"
              onClick={handleClose}
              sx={{
                textTransform: "capitalize",
                fontSize: "16px",
                color: "#3c4bcb",
                "&:hover": {
                  backgroundColor: "#EBEDFE",
                },
              }}
              // disabled={disabled || !formsPopulated() ? true : false}
            >
              Close
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Save and Execute
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default ExtractPsqlModal;
