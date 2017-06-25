
/* load env */
require('dotenv').config();

const app = require('./app');

const port = process.env.PORT || 3000;
const host = process.env.HOSTNAME || '0.0.0.0';

const server = app.listen(port, host, () => {
  console.log(`graphql server is listening on http://${host}:${port}/`);
});
