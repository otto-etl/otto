import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Hourglass, AlertTriangle, FileJson } from "lucide-react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";

const containerStyle = {
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  border: "1px solid #CCC",
  display: "flex",
  height: 60,
  margin: "5px 10px 5px 10px",
};

// todo: extract this out, duplicates NodeBody.js
const nodeIconData = {
  extractApi: { abbreviation: "Ex", bgColor: "#5D92F5" },
  extractPsql: { abbreviation: "Ex", bgColor: "#5D92F5" },
  extractMongo: { abbreviation: "Ex", bgColor: "#5D92F5" },
  transform: { abbreviation: "Tr", bgColor: "#319A9C" },
  load: { abbreviation: "Lo", bgColor: "#A56FD2" },
};

const NodeMetric = ({ nodeName, nodeType, avgTime, avgVolume, failures }) => {
  const nodeBgColor = nodeIconData[nodeType].bgColor;
  const nodeAbbreviation = nodeIconData[nodeType].abbreviation;
  return (
    <div>
      <Table sx={containerStyle}>
        <TableCell sx={{ width: "6%" }}>
          <Typography
            sx={{
              alignItems: "center",
              borderRadius: "4px",
              background: nodeBgColor,
              color: "#FFF",
              display: "flex",
              fontWeight: "700",
              height: "22px",
              justifyContent: "space-around",
              padding: "10px",
              width: "22px",
            }}
          >
            {nodeAbbreviation}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: "10%" }}>
          <Box sx={{ fontSize: "16px", fontWeight: "500" }}>{nodeName}</Box>
        </TableCell>
        <TableCell sx={{ marginTop: "5px", width: "1%" }}>
          <Box>
            <Hourglass />
          </Box>
        </TableCell>
        <TableCell sx={{ fontSize: "14px", fontWeight: "400", width: "21%" }}>
          <Box>Completed in {avgTime} ms (avg)</Box>
        </TableCell>
        <TableCell sx={{ marginTop: "5px", width: "1%" }}>
          <Box>
            <AlertTriangle />
          </Box>
        </TableCell>
        <TableCell sx={{ fontSize: "14px", fontWeight: "400", width: "15%" }}>
          <Box>Failed {failures ? failures : 0} times</Box>
        </TableCell>
        <TableCell sx={{ marginTop: "5px", width: "1%" }}>
          <Box>
            <FileJson />
          </Box>
        </TableCell>
        <TableCell sx={{ fontSize: "14px", fontWeight: "400", width: "18%" }}>
          <Box>{avgVolume} bytes processed (avg)</Box>
        </TableCell>
      </Table>
    </div>
  );
};

export default NodeMetric;
