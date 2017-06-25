const { nodeDefinitions, fromGlobalId } = require('graphql-relay');

const { nodeInterface, nodeField: node, nodesField: nodes } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId);

    return null;
  },
  (obj) => {
    return null;
  },
);

module.exports = { nodeInterface, node, nodes };
