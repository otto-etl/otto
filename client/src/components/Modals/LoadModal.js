import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import CodeMirror from "@uiw/react-codemirror";
import { sql, SQLConfig, StandardSQL } from "@codemirror/lang-sql";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomTabPanel from "../CustomTabPanel";

const LoadModal = ({ nodeObj, handleSubmit, active, handleDelete }) => {
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

  return (
    <Box>
      <form
        action=""
        onSubmit={(e) => {
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
        }}
      >
        <p>Load Details</p>
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
          onChange={(e) => setName(e.target.value)} // variant="outlined"
        />
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
          <TextField
            disabled={active ? true : false}
            id="outlined-basic"
            label="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)} // variant="outlined"
          />
          <br></br>
          <br></br>
          <TextField
            disabled={active ? true : false}
            id="outlined-basic"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // variant="outlined"
          />
          <br></br>
          <br></br>
          <TextField
            disabled={active ? true : false}
            id="outlined-basic"
            label="Host"
            value={host}
            onChange={(e) => setHost(e.target.value)} // variant="outlined"
          />
          <br></br>
          <br></br>
          <TextField
            disabled={active ? true : false}
            id="outlined-basic"
            label="Port"
            value={port}
            onChange={(e) => setPort(e.target.value)} // variant="outlined"
          />
          <br></br>
          <br></br>
          <TextField
            disabled={active ? true : false}
            id="outlined-basic"
            label="Database Name"
            value={dbName}
            onChange={(e) => setDBName(e.target.value)} // variant="outlined"
          />
          <br></br>
          <br></br>
        </CustomTabPanel>

        <CustomTabPanel value={tab} index={1}>
          <TextField
            disabled={active ? true : false}
            id="outlined-basic"
            label="Username"
            value={userNamePD}
            onChange={(e) => setUserNamePD(e.target.value)} // variant="outlined"
          />
          <br></br>
          <br></br>
          <TextField
            disabled={active ? true : false}
            id="outlined-basic"
            label="Password"
            value={passwordPD}
            onChange={(e) => setPasswordPD(e.target.value)} // variant="outlined"
          />
          <br></br>
          <br></br>
          <TextField
            disabled={active ? true : false}
            id="outlined-basic"
            label="Host"
            value={hostPD}
            onChange={(e) => setHostPD(e.target.value)} // variant="outlined"
          />
          <br></br>
          <br></br>
          <TextField
            disabled={active ? true : false}
            id="outlined-basic"
            label="Port"
            value={portPD}
            onChange={(e) => setPortPD(e.target.value)} // variant="outlined"
          />
          <br></br>
          <br></br>
          <TextField
            disabled={active ? true : false}
            id="outlined-basic"
            label="Database Name"
            value={dbNamePD}
            onChange={(e) => setDBNamePD(e.target.value)} // variant="outlined"
          />
          <br></br>
          <br></br>
        </CustomTabPanel>
        <CodeMirror
          readOnly={active ? true : false}
          value={code}
          height="200px"
          extensions={[sql(config)]}
          onChange={handleChange}
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

export default LoadModal;
