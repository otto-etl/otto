import React from "react";
import { Box, Typography } from "@mui/material";

const NodeBody = ({ data, nodeAbbreviation, nodeName, bgColor }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            background: `${bgColor}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            borderRadius: "4px",
            color: "#FFF",
            fontWeight: "700",
            width: "22px",
            height: "22px",
          }}
        >
          {nodeAbbreviation}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              textWrap: "nowrap",
              width: "226px",
            }}
          >
            {data.label}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#555",
            }}
          >
            {nodeName}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default NodeBody;
