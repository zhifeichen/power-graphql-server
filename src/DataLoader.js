const DataLoader = require('dataloader');

const db = require('./db');

function assignType(obj, type) {
  obj.__type = type;
  return obj;
}

function mapTo(keys, keyFn, type, rows) {
  if(!rows) return mapTo.bind(null, keys, keyFn, type);
  const group = new Map(keys.map(key => [key, null]));
  rows.forEach(row => group.set(keyFn(row), assignType(row, type)));
  console.log(keys, group.keys(), group.values());
  return Array.from(group.values());
}

module.exports = {
  create: () => ({
    users: new DataLoader(keys => db.table('sys_users')
      .whereIn('id', keys)
      .select('*')
      .then(mapTo(keys, x => String(x.id), 'User'))),
  }),
};
