export const formatNodeLabel = (nodeType) => {
  let nodeLabel;

  if (nodeType === "extractApi") {
    nodeLabel = `Extract API node`;
  } else if (nodeType === "extractPsql") {
    nodeLabel = `Extract PostgreSQL node`;
  } else if (nodeType === "extractMongo") {
    nodeLabel = `Extract MongoDB node`;
  } else {
    nodeLabel = `${nodeType[0].toUpperCase() + nodeType.slice(1)} node`;
  }
  return nodeLabel;
};
