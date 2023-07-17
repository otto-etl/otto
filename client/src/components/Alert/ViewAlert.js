import React from "react";
import { Alert, Box } from "@mui/material";

const ViewAlert = ({ message }) => {
  return (
    <Box>
      <Alert
        severity="info"
        sx={{
          "&.MuiAlert-root": {
            backgroundColor: "#EBEDFE",
            border: "1px solid #2433B2",
            alignItems: "center",
            padding: "2px 16px",
          },
          "& .MuiAlert-message": {
            color: "#04093A",
            fontSize: "16px",
            fontWeight: "500",
            padding: 0,
          },
          "& .MuiAlert-icon": {
            color: "#2433B2",
          },
        }}
      >
        {message}
      </Alert>
    </Box>
  );
};

export default ViewAlert;
