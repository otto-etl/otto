import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect on extract node from target handle", params)}
        isConnectable={isConnectable}
      />
      <div>
        <strong>{data.label}</strong>
        <p>Input: {JSON.stringify(data.input)}</p>
        <p>Output: {JSON.stringify(data.output)}</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect on extract node from source handle", params)}
        isConnectable={isConnectable}
      />
    </>
  );
});
