const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const { node, nodes } = require('./Node');
const { users } = require('./User');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node,
      nodes,
      users,
    },
  }),
  // mutation: new GraphQLObjectType({
  //   name: 'Mutation',
  //   fields: {},
  // }),
});
