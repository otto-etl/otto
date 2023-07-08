import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
  // console.log(data);

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        onConnect={(params) =>
          console.log(
            "handle onConnect on extract node from target handle",
            params
          )
        }
        isConnectable={isConnectable}
      />
      <div>
        <strong>{data.label}</strong>
        <p>Input: {(data.input) ? "Has input" : "No input"}</p>
        <p>Output: {(data.output) ? "Has output" : "No output"}</p>
        {(data.error) ? <p>ERROR</p> : null}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
        onConnect={(params) =>
          console.log(
            "handle onConnect on extract node from source handle",
            params
          )
        }
        isConnectable={isConnectable}
      />
    </>
  );
});
