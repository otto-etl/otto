import React, { memo } from "react";
import NodeBody from "./NodeBody";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => {}}
        isConnectable={isConnectable}
      />
      <NodeBody
        data={data}
        nodeAbbreviation={"Ex"}
        nodeName={"Extract PostgreSQL"}
        bgColor={"#5D92F5"}
      />
      <Handle
        type="source"
        position={Position.Right}
        onConnect={(params) => {}}
        isConnectable={isConnectable}
      />
    </>
  );
});
