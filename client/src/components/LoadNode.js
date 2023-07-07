import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <div>
        <strong>{data.label}</strong>
        <p>Input: {(data.input) ? "Has input" : "No input"}</p>
        <p>Output: {(data.output) ? "Has output" : "No output"}</p>
        {(data.error) ? <p>ERROR</p> : null}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{ top: 50, background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
});
