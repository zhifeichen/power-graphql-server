
/* eslint-disable no-console, no-shadow */

/* load env */
// const cfg = require('dotenv').config({path: path.resolve(__dirname, '../.env')});
require('dotenv').config();

const app = require('./app');
const db = require('./db');

const port = process.env.PORT || 3000;
const host = process.env.HOSTNAME || '0.0.0.0';

const server = app.listen(port, host, () => {
  console.log(`graphql server is listening on http://${host}:${port}/`);
});

function handleExit(options, err) {
  if (options.cleanup) {
    const actions = [server.close, db.destroy];
    actions.forEach((close, i) => {
      try {
        close(() => { if (i === actions.length - 1) process.exit(); });
      } catch (err) { if (i === actions.length - 1) process.exit(); }
    });
  }
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}

process.on('exit', handleExit.bind(null, { cleanup: true }));
process.on('SIGINT', handleExit.bind(null, { exit: true }));
process.on('SIGTERM', handleExit.bind(null, { exit: true }));
process.on('uncaughtException', handleExit.bind(null, { exit: true }));
