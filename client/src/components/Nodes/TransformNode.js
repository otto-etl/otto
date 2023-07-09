import React, { memo } from "react";
import NodeBody from "./NodeBody";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <NodeBody
        data={data}
        nodeAbbreviation={"Tr"}
        nodeName={"Transform"}
        bgColor={"#319A9C"}
      />
      {/* <div>
        <strong>{data.label}</strong>
        <p>Input: {data.input ? "Has input" : "No input"}</p>
        <p>Output: {data.output ? "Has output" : "No output"}</p>
        {data.error ? <p>ERROR</p> : null}
      </div> */}
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
    </>
  );
});
