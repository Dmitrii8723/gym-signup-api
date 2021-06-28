const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const sendVerificationLink = require('../../sendgrid');

const db = {};
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

console.log('process.env.DB_DIALECT', process.env.DB_DIALECT);
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.USERNAME,
  '', //password
  {
    db: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    scheme: process.env.DB_SCHEMA,
  }
);
console.log(
  `🚀 sequelize ORM connected to ${process.env.DB_DIALECT} @ ${process.env.DB_HOST}:${process.env.DB_PORT}`
);

// loading all sequelize models from the 'models' folder
fs.readdirSync(path.join(__dirname, './models'))
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, 'models', file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * constructResponse - constructs the API response payload
 *
 * containing the actual data, a count of records the data contains and an error object
 *
 * @param {INT} count
 * @param {ARRAY} data
 * @param {JSON} error
 */
let constructResponse = function (data, error) {
  return data;
};

db.getAllUsers = async (request) => {
  return db.users.findAll().then((res) => constructResponse(res));
};

// Move to routes.js
db.createUser = async (request) => {
  const { fname, lname, email, password } = request;
  if (typeof email === 'string' && !validator.isEmail(email)) {
    return 400;
  }

  // Check if an account with this email already exists
  const existingAccountData = await db.users.findOne({ where: { email } });
  if (existingAccountData) {
    return 409;
  }

  // Hashing password
  const hashedPassword = bcryptjs.hashSync(password, 6);
  /*
   * Create verification token.
   * It's stored in database till the moment user verifies his/her account
   */
  const token = crypto.randomBytes(32).toString('hex');
  await db.users.create(
    Object.assign(request, { password: hashedPassword, token })
  );
  sendVerificationLink(email, token);
  return 200;
};

db.updateUser = async (request) => {
  const existingUser = await db.users.findOne({
    where: { token: request.token },
  });
  // Account was verified previously
  if (!existingUser) return 401;
  await db.users.update(Object.assign(request, { token: null }), {
    where: { email: existingUser.email },
  });
  return 201;
};

module.exports = db;
