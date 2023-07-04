import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";

const TransformModal = ({ nodeObj, handleSubmit }) => {
  console.log(nodeObj.data);
  const [name, setName] = useState(nodeObj.data.label);
  const [code, setCode] = useState(nodeObj.data.jsCode);

  const handleChange = React.useCallback((value, viewupdate) => {
    setCode(value);
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
            jsCode: code,
          };
          console.log(newData);
          handleSubmit(e, newData);
        }}
      >
        <TextField
          id="outlined-basic"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} // variant="outlined"
        />
        <br></br>
        <br></br>
        <CodeMirror
          value={code}
          height="200px"
          extensions={[javascript({ jsx: true })]}
          onChange={handleChange}
        />
        <br></br>
        <br></br>
        <Button variant="contained" color="primary" type="submit">
          Save and Execute
        </Button>
      </form>
    </Box>
  );
};

export default TransformModal;
