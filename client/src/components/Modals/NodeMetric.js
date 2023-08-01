import React, { useState } from "react";
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
  gap: "16px",
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
  const [nodeBgColor, setNodeBgColor] = useState(
    nodeIconData[nodeType].bgColor
  );
  const [nodeAbbreviation, setNodeAbbreviation] = useState(
    nodeIconData[nodeType].abbreviation
  );

  return (
    <div>
      <Table sx={containerStyle}>
        <TableCell sx={{ border: "none", padding: 0, "margin-left": "16px" }}>
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
              padding: "6px",
              width: "22px",
            }}
          >
            {nodeAbbreviation}
          </Typography>
        </TableCell>
        <TableCell
          sx={{
            border: "none",
            padding: 0,
          }}
        >
          <Box
            sx={{
              fontSize: "16px",
              fontWeight: "500",
              border: "none",
              textOverflow: "ellipsis",
              textWrap: "nowrap",
              width: "260px",
              overflow: "hidden",
            }}
          >
            <span>{nodeName}</span>
          </Box>
        </TableCell>
        <TableCell
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            border: "none",
            padding: 0,
            width: "24%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Hourglass size={20} />
            Completed in {avgTime} ms (avg)
          </Box>
        </TableCell>
        <TableCell
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            border: "none",
            padding: 0,
            width: "16%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertTriangle size={20} />
            Failed {failures ? failures : 0} times
          </Box>
        </TableCell>
        <TableCell
          sx={{
            fontSize: "14px",
            fontWeight: "400",
            border: "none",
            padding: 0,
            width: "24%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileJson size={20} /> {avgVolume} bytes processed (avg)
          </Box>
        </TableCell>
      </Table>
    </div>
  );
};

export default NodeMetric;
