const { GraphQLNonNull, GraphQLList, GraphQLID, GraphQLString, GraphQLInt, GraphQLBoolean } = require('graphql');

const { DeviceTreeType } = require('./DeviceTreeType');

const deviceTrees = {
  type: new GraphQLList(DeviceTreeType),
  args: {
    parentId: {
      type: GraphQLInt,
      defaultValue: 0,
    },
  },
  resolve(parent, args, { deviceTreeByParent }) {
    return deviceTreeByParent.load(args.parentId);
  },
};

module.exports = {
  deviceTrees,
};
