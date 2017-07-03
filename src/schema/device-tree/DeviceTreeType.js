const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString } = require('graphql');
const { globalIdField } = require('graphql-relay');

const { nodeInterface } = require('../Node');

const db = require('../../db');

const DeviceTreeType = new GraphQLObjectType({
  name: 'DeviceTree',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField(),

    parentId: {
      type: GraphQLInt,
      resolve(parent) {
        return parent.parent_device_id;
      },
    },
    seq: {
      type: GraphQLInt,
      resolve(parent) {
        return parent.device_seq;
      },
    },
    deviceId: {
      type: GraphQLInt,
      resolve(parent) {
        return parent.device_id;
      },
    },
    deviceType: {
      type: GraphQLInt,
      resolve(parent) {
        return parent.node_type;
      },
    },
    isRemove: {
      type: GraphQLInt,
      resolve(parent) {
        return parent.remove;
      },
    },
    deviceName: {
      type: GraphQLString,
      async resolve(parent) {
        const device = await db.table('device_devices').where('device_id', parent.device_id).select('device_name');
        return device[0].device_name;
      },
    },
    children: {
      type: new GraphQLList(DeviceTreeType),
      resolve(parent, args, { deviceTreeByParent }) {
        return deviceTreeByParent.load(parent.device_id);
      },
    },
  }),
});

module.exports = {
  DeviceTreeType,
};
