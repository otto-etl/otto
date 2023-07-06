import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <div>
        <strong>{data.label}</strong>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: 50, background: "#555" }}
        onConnect={(params) =>
          console.log("handle onConnect on trigger node", params)
        }
        isConnectable={isConnectable}
      />
    </>
  );
});
