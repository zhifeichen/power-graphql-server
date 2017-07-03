const DataLoader = require('dataloader');

const db = require('./db');

function assignType(obj, type) {
  // eslint-disable-next-line no-param-reassign, no-underscore-dangle
  obj.__type = type;
  return obj;
}

function mapTo(keys, keyFn, type, rows) {
  if (!rows) return mapTo.bind(null, keys, keyFn, type);
  const group = new Map(keys.map(key => [key, null]));
  rows.forEach(row => group.set(keyFn(row), assignType(row, type)));
  // console.log('mapTo: ', keys, group.keys(), group.values());
  return Array.from(group.values());
}

function mapToMany(keys, keyFn, type, rows) {
  if (!rows) return mapToMany.bind(null, keys, keyFn, type);
  const group = new Map(keys.map(key => [key, []]));
  rows.forEach(row => group.get(keyFn(row)).push(assignType(row, type)));
  // console.log('mapToMany: ', keys, group.keys(), group.values());
  return Array.from(group.values());
}

module.exports = {
  create: () => ({
    users: new DataLoader(keys => db.table('sys_users')
      .whereIn('id', keys)
      .select('*')
      .then(mapTo(keys, x => String(x.id), 'User'))),
    deviceTree: new DataLoader(keys => db.table('device_tree')
      .whereIn('id', keys)
      .select('*')
      .then(mapTo(keys, x => x.id, 'DeviceTree'))),
    deviceTreeByParent: new DataLoader(keys => db.table('device_tree')
      .leftJoin('device_devices', 'device_tree.device_id', 'device_devices.device_id')
      .whereIn('device_tree.parent_device_id', keys)
      .select('*')
      .then(mapToMany(keys, x => x.parent_device_id, 'DeviceTree'))),
  }),
};
