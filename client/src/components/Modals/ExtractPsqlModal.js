import React, { useState } from "react";
import CustomTabPanel from "../CustomTabPanel";
import {
  Typography,
  IconButton,
  Alert,
  AlertTitle,
  Box,
  Button,
  Stack,
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { sql, SQLConfig, StandardSQL } from "@codemirror/lang-sql";
import { EditorView } from "@codemirror/view";

const ExtractPsqlModal = ({
  nodeObj,
  handleSubmit,
  disabled,
  handleDelete,
}) => {
  console.log(nodeObj);
  const [name, setName] = useState(nodeObj.data.label);
  const [code, setCode] = useState(nodeObj.data.sqlCode);
  const [userName, setUserName] = useState(nodeObj.data.userName);
  const [password, setPassword] = useState(nodeObj.data.password);
  const [host, setHost] = useState(nodeObj.data.host);
  const [port, setPort] = useState(nodeObj.data.port);
  const [dbName, setDBName] = useState(nodeObj.data.dbName);
  const [userNamePD, setUserNamePD] = useState(nodeObj.data.userNamePD);
  const [passwordPD, setPasswordPD] = useState(nodeObj.data.passwordPD);
  const [hostPD, setHostPD] = useState(nodeObj.data.hostPD);
  const [portPD, setPortPD] = useState(nodeObj.data.portPD);
  const [dbNamePD, setDBNamePD] = useState(nodeObj.data.dbNamePD);
  const [error, setError] = useState(nodeObj.data.error);
  const [tab, setTab] = useState(0);

  const handleChange = React.useCallback((value, viewupdate) => {
    setCode(value);
  }, []);

  const config = {
    dialect: StandardSQL,
    upperCaseKeywords: true,
  };

  const formsPopulated = () => {
    return name && code && userName && password && host && port && dbName;
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const handleTabChange = React.useCallback((e, newValue) => {
    setTab(newValue);
  }, []);

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
      userNamePD: userNamePD,
      passwordPD: passwordPD,
      hostPD: hostPD,
      portPD: portPD,
      dbNamePD: dbNamePD,
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
            overflow: "scroll",
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
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                aria-label="basic tabs example"
              >
                <Tab label="Test Database" {...a11yProps(0)} />
                <Tab label="Production Database" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "30px" }}
              >
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // variant="outlined"
                  size={"small"}
                />
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
            </CustomTabPanel>

            <CustomTabPanel value={tab} index={1}>
              <TextField
                disabled={disabled ? true : false}
                id="outlined-basic"
                label="Username"
                value={userNamePD}
                onChange={(e) => setUserNamePD(e.target.value)} // variant="outlined"
                size={"small"}
              />
              <TextField
                disabled={disabled ? true : false}
                id="outlined-basic"
                label="Password"
                value={passwordPD}
                onChange={(e) => setPasswordPD(e.target.value)} // variant="outlined"
                size={"small"}
              />
              <TextField
                disabled={disabled ? true : false}
                id="outlined-basic"
                label="Host"
                value={hostPD}
                onChange={(e) => setHostPD(e.target.value)} // variant="outlined"
                size={"small"}
              />
              <TextField
                disabled={disabled ? true : false}
                id="outlined-basic"
                label="Port"
                value={portPD}
                onChange={(e) => setPortPD(e.target.value)} // variant="outlined"
                size={"small"}
              />
              <TextField
                disabled={disabled ? true : false}
                id="outlined-basic"
                label="Database Name"
                value={dbNamePD}
                onChange={(e) => setDBNamePD(e.target.value)} // variant="outlined"
                size={"small"}
              />
            </CustomTabPanel>
          </Box>
          <CodeMirror
            readOnly={disabled ? true : false}
            value={code}
            height="200px"
            extensions={[sql(config), EditorView.lineWrapping]}
            onChange={handleChange}
            size={"small"}
          />
        </Box>
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

export default ExtractPsqlModal;
