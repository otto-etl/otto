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

export const convertLabel = (label) => {
  const words = label.toLowerCase().split(" ");
  return words
    .map((word, idx) => {
      if (idx !== 0) {
        return word[0].toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join("");
};
