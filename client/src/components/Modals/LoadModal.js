import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CodeMirror from "@uiw/react-codemirror";
import { sql, SQLConfig, StandardSQL } from "@codemirror/lang-sql";

const LoadModal = ({ nodeObj, handleSubmit, active }) => {
  const [name, setName] = useState(nodeObj.data.label);
  const [code, setCode] = useState(nodeObj.data.sqlCode);
  const [userName, setUserName] = useState(nodeObj.data.userName);
  const [password, setPassword] = useState(nodeObj.data.password);
  const [host, setHost] = useState(nodeObj.data.host);
  const [port, setPort] = useState(nodeObj.data.port);
  const [dbName, setDBName] = useState(nodeObj.data.dbName);

  const handleChange = React.useCallback((value, viewupdate) => {
    setCode(value);
  }, []);

  const config = {
    dialect: StandardSQL,
    upperCaseKeywords: true,
  };

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
            sqlCode: code,
          };
          console.log(newData);
          handleSubmit(e, newData);
        }}
      >
        <TextField
          disabled={active ? true : false}
          id="outlined-basic"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} // variant="outlined"
        />
        <br></br>
        <br></br>
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
        <CodeMirror
          readOnly={active ? true : false}
          value={code}
          height="200px"
          extensions={[sql(config)]}
          onChange={handleChange}
        />
        <br></br>
        <br></br>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={active ? true : false}
        >
          Save and Execute
        </Button>
      </form>
    </Box>
  );
};

export default LoadModal;
