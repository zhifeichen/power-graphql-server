
/* eslint-disable global-require, no-underscore-dangle */

const { nodeDefinitions, fromGlobalId } = require('graphql-relay');

const { nodeInterface, nodeField: node, nodesField: nodes } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'User') return context.users.load(id);
    if (type === 'DeviceTree') return context.deviceTree.load(id);

    return null;
  },
  (obj) => {
    if (obj.__type === 'User') return require('./user').UserType;
    if (obj.__type === 'DeviceTree') return require('./device-tree').DeviceTreeType;

    return null;
  },
);

module.exports = { nodeInterface, node, nodes };
