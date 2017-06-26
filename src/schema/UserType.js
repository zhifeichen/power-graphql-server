const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean } = require('graphql');
const { globalIdField } = require('graphql-relay');

const { nodeInterface } = require('./Node');

module.exports = new GraphQLObjectType({
  name: 'User',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    loginName: {
      type: GraphQLString,
      resolve(parent) {
        return parent.user_loginname;
      },
    },

    userName: {
      type: GraphQLString,
      resolve(parent) {
        return parent.user_name;
      },
    },

    power: {
      type: GraphQLInt,
      resolve(parent) {
        return parent.user_power;
      },
    },

    department: {
      type: GraphQLString,
      resolve(parent) {
        return parent.user_department;
      },
    },

    group: {
      type: GraphQLString,
      resolve(parent) {
        return parent.user_group;
      },
    },

    telephone: {
      type: GraphQLString,
      resolve(parent) {
        return parent.telephone;
      },
    },

    isDefind: {
      type: GraphQLBoolean,
      resolve(parent) {
        return parent.user_is_defind;
      },
    },
  },
});
