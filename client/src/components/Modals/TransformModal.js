import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";


const TransformModal = ({ nodeObj, handleSubmit, active, handleDelete }) => {
  console.log(nodeObj.data);
  const [name, setName] = useState(nodeObj.data.label);
  const [code, setCode] = useState(nodeObj.data.jsCode);
  const [error, setError] = useState(nodeObj.data.error);

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
        <CodeMirror
          readOnly={active ? true : false}
          value={code}
          height="200px"
          extensions={[javascript({ jsx: true })]}
          onChange={handleChange}
        />
		<Button onClick={handleDelete} disabled={active ? true : false}>Delete Node</Button>
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

export default TransformModal;
