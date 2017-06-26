const { GraphQLNonNull, GraphQLInt } = require('graphql');
const {
  // fromGlobalId,
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
  // mutationWithClientMutationId,
} = require('graphql-relay');

const db = require('../db');
const UserType = require('./UserType');

const me = {
  type: UserType,
  resolve(root, args, { user, users }) {
    return user && users.load(user.id);
  },
};

const users = {
  type: connectionDefinitions({
    name: 'User',
    nodeType: UserType,
    connectionFields: {
      totalCount: {
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
  }).connectionType,
  args: forwardConnectionArgs,
  async resolve(root, args) {
    const limit = typeof args.first === 'undefined' ? '10' : args.first;
    const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

    const [data, totalCount] = await Promise.all([
      db.table('sys_users')
        .limit(limit).offset(offset)
        .then(rows => rows.map(x => Object.assign(x, { __type: 'User' }))),
      db.table('sys_users')
        .count('* as count').then(x => x[0].count),
    ]);

    return {
      ...connectionFromArraySlice(data, args, {
        sliceStart: offset,
        arrayLength: totalCount,
      }),
      totalCount,
    };
  },
};

module.exports = { me, users };
