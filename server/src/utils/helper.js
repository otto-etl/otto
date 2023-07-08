export const isValidArray = (input) => {
  return Array.isArray(input) && input.length !== 0;
};

export const dataIsEmpty = (data) => {
  return (
    !data ||
    Object.keys(data).length === 0 ||
    (Array.isArray(data) && data.length === 0)
  );
};

export const validNodeTypes = (nodes) => {
  const validNodeTypes = ["schedule", "transform", "extract", "load"];
  for (const node of nodes) {
    if (!validNodeTypes.includes(node.type)) {
      return false;
    }
  }
  return true;
};
