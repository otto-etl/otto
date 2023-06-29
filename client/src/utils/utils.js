export const updateInputs = (nodes) => {
  nodes.forEach((node) => {
    if (node.data.prev) {
      const prev = nodes.find((othNode) => othNode.id === node.data.prev);
      node.data.input = prev.data.output;
    }
  });
};
