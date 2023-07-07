import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;
  console.log(children);
  console.log(value);
  console.log(index);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
          {/* <Typography>{children}</Typography> */}
        </Box>
      )}
    </div>
  );
};

const TransformModal = ({ nodeObj, handleSubmit, active, handleDelete }) => {
  console.log(nodeObj.data);
  const [name, setName] = useState(nodeObj.data.label);
  const [code, setCode] = useState(nodeObj.data.jsCode);
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
