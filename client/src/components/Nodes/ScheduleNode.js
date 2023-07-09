import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import NodeBody from "./NodeBody";

export default memo(({ data, isConnectable }) => {
  return (
    <>
      <NodeBody
        data={data}
        nodeAbbreviation={"Sc"}
        nodeName={"Schedule"}
        bgColor={"#ED912D"}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        onConnect={(params) =>
          console.log("handle onConnect on trigger node", params)
        }
        isConnectable={isConnectable}
      />
    </>
  );
});
