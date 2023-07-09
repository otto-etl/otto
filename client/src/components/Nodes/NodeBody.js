import React from "react";
import { Box, Typography } from "@mui/material";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const NodeBody = ({ data, nodeAbbreviation, nodeName, bgColor }) => {
  return (
    <>
      {data.output ? (
        <Box
          sx={{
            position: "absolute",
            right: "-12px",
            top: "-12px",
          }}
        >
          <CheckCircle2 stroke={"#247c44"} fill={"#9ce2b7"} size={24} />
        </Box>
      ) : null}
      {data.error ? (
        <Box
          className={"alertTriangle"}
          sx={{
            position: "absolute",
            right: "-12px",
            top: "-12px",
          }}
        >
          <AlertTriangle size={24} fill={"#fcbaba"} stroke={"#902b2b"} />
        </Box>
      ) : null}
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            alignItems: "center",
            borderRadius: "4px",
            color: "#FFF",
            background: `${bgColor}`,
            display: "flex",
            fontWeight: "700",
            height: "22px",
            justifyContent: "center",
            padding: "10px",
            width: "22px",
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
