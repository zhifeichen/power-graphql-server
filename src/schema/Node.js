
/* eslint-disable global-require, no-underscore-dangle */

const { nodeDefinitions, fromGlobalId } = require('graphql-relay');

const { nodeInterface, nodeField: node, nodesField: nodes } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'User') return context.users.load(id);

    return null;
  },
  (obj) => {
    if (obj.__type === 'User') return require('./UserType');

    return null;
  },
);

module.exports = { nodeInterface, node, nodes };
