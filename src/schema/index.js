const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const { node, nodes } = require('./Node');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node,
      nodes,
    },
  }),
  // mutation: new GraphQLObjectType({
  //   name: 'Mutation',
  //   fields: {},
  // }),
});
