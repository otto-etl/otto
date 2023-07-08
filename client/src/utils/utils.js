
export const isScheduleNode = (nodeId, nodes) => {
  const nodeToCheck = nodes.find((node) => node.id === nodeId);
  return nodeToCheck && nodeToCheck.type === "schedule";
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
