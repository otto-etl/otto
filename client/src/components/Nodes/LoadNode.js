import React, { memo } from "react";
import NodeBody from "./NodeBody";
import { Handle, Position } from "reactflow";

/* eslint-disable */
export default memo(({ data, isConnectable }) => {
  return (
    <>
      <NodeBody
        data={data}
        nodeAbbreviation={"Lo"}
        nodeName={"Load"}
        bgColor={"#A56FD2"}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        // style={{ top: 50, background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
});
