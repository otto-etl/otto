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
