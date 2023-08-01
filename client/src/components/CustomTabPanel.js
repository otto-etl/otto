import Box from "@mui/material/Box";
import React from "react";
const CustomTabPanel = (props) => {
  const { children, value, index, scrollOffset, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            // m: 3,
            marginTop: "20px",
            height: `calc(100vh - ${scrollOffset})`,
            overflow: "auto",
          }}
        >
          {children}
          {/* <Typography>{children}</Typography> */}
        </Box>
      )}
    </Box>
  );
};

export default CustomTabPanel;
