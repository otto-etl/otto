import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CustomTabPanel from "../CustomTabPanel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
import { Typography, IconButton } from "@mui/material";
import { Trash2 } from "lucide-react";

const TransformModal = ({ nodeObj, handleSubmit, disabled, handleDelete }) => {
  console.log("transform", nodeObj.data);
  const [name, setName] = useState(nodeObj.data.label);
  const [code, setCode] = useState(nodeObj.data.jsCode);
  const [error, setError] = useState(nodeObj.data.error);
  const [tab, setTab] = useState(0);

  const formsPopulated = () => {
    return name && code;
  };

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
  // console.log(code);
  return (
    <Box>
      <Typography sx={{ fontSize: "20px", fontWeight: "500", padding: "20px" }}>
        Transform Details
      </Typography>
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
            <Alert sx={{ border: "2px solid #B99" }} severity="error">
              <AlertTitle sx={{ fontWeight: "700", color: "#200" }}>
                Error:
              </AlertTitle>
              <p>Your JavaScript code could not be executed:</p>
              <p style={{ fontWeight: "600", textIndent: "10px" }}>
                {error.message.includes("JS code")
                  ? error.message.split("with error")[1]
                  : error.message}
              </p>
              <p>Please modify the code and try again.</p>
            </Alert>
          ) : null}
          <Box>
            <TextField
              disabled={disabled ? true : false}
              id="outlined-basic"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)} // variant="outlined"
              sx={{ width: "100%" }}
            />
          </Box>
          <Box>
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
                readOnly={disabled ? true : false}
                value={code}
                height="200px"
                extensions={[
                  javascript({ jsx: true }),
                  EditorView.lineWrapping,
                ]}
                onChange={handleChange}
              />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1}>
              <CodeMirror
                readOnly={disabled ? true : false}
                value={code}
                height="200px"
                extensions={[python(), EditorView.lineWrapping]}
                onChange={handleChange}
              />
            </CustomTabPanel>
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
            <Trash2 color="#555" size={26} strokeWidth={1.5} />
            {/* // #d32f2f */}
          </IconButton>

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

export default TransformModal;
