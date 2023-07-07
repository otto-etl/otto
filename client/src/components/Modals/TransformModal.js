import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CustomTabPanel from "../CustomTabPanel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

const TransformModal = ({ nodeObj, handleSubmit, active, handleDelete }) => {
  console.log(nodeObj.data);
  const [name, setName] = useState(nodeObj.data.label);
  const [code, setCode] = useState(nodeObj.data.jsCode);
  const [error, setError] = useState(nodeObj.data.error);
  const [tab, setTab] = useState(0);
  
  const handleChange = React.useCallback((value, viewupdate) => {
    setCode(value);
  }, []);

  const handleTabChange = React.useCallback((e, newValue) => {
    setTab(newValue);
  }, []);

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
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
            jsCode: code,
          };
          handleSubmit(e, newData);
        }}
      >
		<p>Transform Details</p>
        <TextField
          disabled={active ? true : false}
          id="outlined-basic"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} // variant="outlined"
        />
		<br></br>
		<br></br>
		{error ? 
	  	  <Alert sx={{margin:"10px 0 0 0",border:"2px solid #B99"}}severity="error">
		    <AlertTitle sx={{fontWeight:"700", color:"#200"}}>Error:</AlertTitle>
		    <p>Your JavaScript code could not be executed:</p>
		    <p style={{fontWeight:"600",textIndent:"10px"}}>{error.message.includes("JS code") ? error.message.split("with error")[1] : error.message}</p>
		    <p>Please modify the code and try again.</p>
		  </Alert>
		: null}
        <br></br>
        <br></br>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Javascript" {...a11yProps(0)} />
            <Tab label="Python" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tab} index={0}>
          <CodeMirror
            readOnly={active ? true : false}
            value={code}
            height="200px"
            extensions={[javascript({ jsx: true })]}
            onChange={handleChange}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1}>
          <CodeMirror
            readOnly={active ? true : false}
            value={code}
            height="200px"
            extensions={[python()]}
            onChange={handleChange}
          />
        </CustomTabPanel>
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
        <Button onClick={handleDelete} disabled={active ? true : false}>
          Delete Node
        </Button>
      </form>
    </Box>
  );
};

export default TransformModal;
