const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const schema = makeExecutableSchema({
  typeDefs: importSchema('src/graphql/typeDefs/schema.gql'),
  resolvers,
});

module.exports = schema;
