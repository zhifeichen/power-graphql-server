const { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLBoolean } = require('graphql');
const {
  fromGlobalId,
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
  mutationWithClientMutationId,
} = require('graphql-relay');

const db = require('../../db');
const UserType = require('./UserType');
const ValidationError = require('../ValidationError');

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

const inputFields = {
  loginName: {
    type: GraphQLString,
  },

  userName: {
    type: GraphQLString,
  },

  userPwd: {
    type: GraphQLString,
  },

  power: {
    type: GraphQLInt,
  },

  department: {
    type: GraphQLString,
  },

  group: {
    type: GraphQLString,
  },

  telephone: {
    type: GraphQLString,
  },

  isDefind: {
    type: GraphQLBoolean,
  },
};

const outputFields = {
  user: {
    type: UserType,
  },
};

function validate(input) {
  const errors = [];
  const data = {};

  if (input.loginName == null || input.loginName.trim() === '') {
    errors.push({ key: 'loginName', message: 'The loginName field cannot be empty.' });
  } else {
    data.user_loginname = input.loginName;
  }

  if (input.userName == null || input.userName.trim() === '') {
    errors.push({ key: 'userName', message: 'The userName field cannot be empty.' });
  } else {
    data.user_name = input.userName;
  }

  if (input.userPwd == null || input.userPwd.trim() === '') {
    errors.push({ key: 'userPwd', message: 'The userPwd field cannot be empty.' });
  } else {
    data.user_pwd = input.userPwd;
  }

  if (input.power == null || input.power < 0 || input.power > 2) {
    errors.push({ key: 'power', message: 'The power field only can be 0, 1, 2.' });
  } else {
    data.user_power = input.power;
  }

  /* eslint-disable no-unused-expressions */
  input.department && (data.user_department = input.department);
  input.group && (data.user_group = input.group);
  input.isDefind && (data.user_is_defind = input.isDefind);
  input.telephone && (data.telephone = input.telephone);
  /* eslint-enable */

  return { data, errors };
}

const createUser = mutationWithClientMutationId({
  name: 'CreateUser',
  inputFields,
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { data, errors } = validate(input);

    if (errors.length) {
      throw new ValidationError(errors);
    }
    const rows = await db.table('sys_users').insert(data).returning('id');
    return context.users.load(String(rows[0])).then(user => ({ user }));
  },
});

const updateUser = mutationWithClientMutationId({
  name: 'UpdateUser',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    ...inputFields,
  },
  outputFields,
  async mutateAndGetPayload(input, context) {
    const { type, id } = fromGlobalId(input.id);

    if (type !== 'User') {
      throw new Error('The user ID is invalid.');
    }

    const { data, errors } = validate(input);
    const user = await db.table('sys_users').where('id', '=', id).first('*');
    if (!user) {
      errors.push('Failed to save the user, Please make sure that user exists.');
    }

    if (errors.length) {
      throw new ValidationError(errors);
    }

    await db.table('sys_users').where('id', '=', id).update(data);
    await context.users.clear(String(id));
    return context.users.load(String(id)).then(u => ({ user: u }));
  },
});

module.exports = {
  me,
  users,
  createUser,
  updateUser,
};
