const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressGraphQL = require('express-graphql');

const { printSchema } = require('graphql');

const schema = require('./schema');
const DataLoader = require('./DataLoader');

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/graphql/schema', (req, res) => {
  res.type('text/plain').send(printSchema(schema));
});

app.use('/graphql', expressGraphQL(req => ({ // eslint-disable-line no-unused-vars
  schema,
  context: {
    ...DataLoader.create(),
  },
  graphiql: process.env.NODE_ENV !== 'production',
  pretty: process.env.NODE_ENV !== 'production',
})));

module.exports = app;
