export const isScheduleNode = (nodeId, nodes) => {
  const nodeToCheck = nodes.find((node) => node.id === nodeId);
  return nodeToCheck && nodeToCheck.type === "schedule";
};

export const isExtractNode = (nodeId, nodes) => {
  const nodeToCheck = nodes.find((node) => node.id === nodeId);
  return nodeToCheck && nodeToCheck.type.slice(0, 7) === "extract";
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
  const words = label.trim().toLowerCase().split(" ");
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

/* Runs upon initial load of page if the workflow property "orphans" is false.
   In practice, this means it runs once, at workflow creation.
*/
export const workflowHasOrphanNodes = (nodes, edges) => {
  let nodeEdgeTracker = {};
  let hasOrphans = false;
  nodes.forEach((node) => {
    nodeEdgeTracker[node.id] = {
      type: node.type,
      hasSource: false,
      hasTarget: false,
    };
  });
  edges.forEach((edge) => {
    if (edge.source) {
      nodeEdgeTracker[edge.source].hasTarget = true;
    }
    if (edge.target) {
      nodeEdgeTracker[edge.target].hasSource = true;
    }
  });
  Object.keys(nodeEdgeTracker).forEach((node) => {
    if (
      nodeEdgeTracker[node].type === "schedule" &&
      !nodeEdgeTracker[node].hasTarget
    ) {
      hasOrphans = true;
    } else if (
      nodeEdgeTracker[node].type === "load" &&
      !nodeEdgeTracker[node].hasSource
    ) {
      hasOrphans = true;
    } else if (
      (nodeEdgeTracker[node].type === "extract" ||
        nodeEdgeTracker[node].type === "transform") &&
      (!nodeEdgeTracker[node].hasSource || !nodeEdgeTracker[node].hasTarget)
    ) {
      hasOrphans = true;
    }
  });
  return hasOrphans;
};

export const uniqueNewExecutions = (prev, newData) => {
  return newData.filter((newObj) => {
    return !prev.map((oldObj) => oldObj.id).includes(newObj.id);
  });
};
