import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { Typography, IconButton } from "@mui/material";
import { Trash2 } from "lucide-react";

const TransformModal = ({
  nodeObj,
  handleSubmit,
  disabled,
  handleDelete,
  handleClose,
  error,
}) => {
  console.log("transform", nodeObj.data);
  const [name, setName] = useState(nodeObj.data.label);
  const [code, setCode] = useState(nodeObj.data.jsCode);
  const [tab, setTab] = useState(0);

  const formsPopulated = () => {
    return name && code;
  };

  const handleChange = React.useCallback((value, viewupdate) => {
    setCode(value);
  }, []);

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
              onChange={(e) => setName(e.target.value)}
              sx={{ width: "100%", marginTop: "5px" }}
              size={"small"}
            />
          </Box>
          <Box>
            <Typography sx={{ color: "#555" }}>JavaScript</Typography>
            <Box
              sx={{
                marginTop: "10px",
                fontSize: "14px",
                border: "1px solid #ddd",
              }}
            >
              <CodeMirror
                readOnly={disabled ? true : false}
                value={code}
                height="calc(100vh - 360px)"
                extensions={[
                  javascript({ jsx: true }),
                  EditorView.lineWrapping,
                ]}
                onChange={handleChange}
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
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={disabled || !formsPopulated() ? true : false}
            >
              Save and Execute
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default TransformModal;
