import React, { memo } from "react";
import NodeBody from "./NodeBody";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) =>
          console.log(
            "handle onConnect on extract node from target handle",
            params
          )
        }
        isConnectable={isConnectable}
      />
      <NodeBody
        data={data}
        nodeAbbreviation={"Ex"}
        nodeName={"Extract"}
        bgColor={"#5D92F5"}
      />
      <Handle
        type="source"
        position={Position.Right}
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

// <div>
// <strong>{data.label}</strong>
// <p>Input: {data.input ? "Has input" : "No input"}</p>
// <p>Output: {data.output ? "Has output" : "No output"}</p>
// {data.error ? <p>ERROR</p> : null}
// </div>
