const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const { node, nodes } = require('./Node');
const { users, createUser, updateUser } = require('./user');
const { deviceTrees } = require('./device-tree');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node,
      nodes,
      users,
      deviceTrees,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser,
      updateUser,
    },
  }),
});
