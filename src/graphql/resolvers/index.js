const { PubSub } = require('apollo-server');

const pubsub = new PubSub();

/**
 * extractInput - extracts the actual input payload from the graphql input
 * in case no input was provided, the function returns an empty JSON object
 *
 * @param {*} args
 */
// let getQuery = function (args) {
//   return args.query ? args.query : {};
// };

// let getInput = function (args) {
//   return args.input ? args.input : {};
// };

module.exports = {
  Query: {
    users: (parent, args, { db }, info) => db.getAllUsers(args, info),
  },
  Mutation: {
    createUser: (parent, args, { db }, info) => db.createUser(args, info),
    updateUser: (parent, args, { db }, info) => db.updateUser(args, info),
  },
};
