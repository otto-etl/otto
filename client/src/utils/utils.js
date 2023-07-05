export const updateInputs = (nodes) => {
  nodes.forEach((node) => {
    if (node.data.prev) {
      const prev = nodes.find((othNode) => othNode.id === node.data.prev);
      node.data.input = prev.data.output;
    }
  });
};

export const isTriggerNode = (nodeId, nodes) => {
  const nodeToCheck = nodes.find((node) => node.id === nodeId);
  return nodeToCheck && nodeToCheck.type === "trigger";
};

export const isExtractNode = (nodeId, nodes) => {
  const nodeToCheck = nodes.find((node) => node.id === nodeId);
  return nodeToCheck && nodeToCheck.type === "extract";
};

export const isTransformNode = (nodeId, nodes) => {
  const nodeToCheck = nodes.find((node) => node.id === nodeId);
  return nodeToCheck && nodeToCheck.type === "transform";
};

export const isLoadNode = (nodeId, nodes) => {
  const nodeToCheck = nodes.find((node) => node.id === nodeId);
  return nodeToCheck && nodeToCheck.type === "load";
};
