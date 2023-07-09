import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div>
        <strong>{data.label}</strong>
        <p>Input: {data.input ? "Has input" : "No input"}</p>
        <p>Output: {data.output ? "Has output" : "No output"}</p>
        {data.error ? <p>ERROR</p> : null}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        // style={{ top: 50, background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
});
