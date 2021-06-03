const { Pool } = require('pg');

// Create db pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'postgres',
  port: 5432,
});

const findAccountByEmail = async (email) =>
  new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
      (error, results) => {
        if (error) {
          reject(error);
        }
        return resolve(results.rows);
      }
    );
  });

const findAccountByVerificationToken = async (token) =>
  new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM users WHERE token = $1',
      [token],
      (error, results) => {
        if (error) {
          reject(error);
        }
        return resolve(results.rows);
      }
    );
  });

const updateAccountDetails = async (email) =>
  new Promise((resolve, reject) => {
    pool.query(
      'UPDATE users SET email_verified = $1, token = $2, updated_at = $3 WHERE email = $4',
      [true, null, new Date(), email],
      (error, results) => {
        if (error) {
          reject(error);
        }
        return resolve(results);
      }
    );
  });

const createAccount = async ({
  fname,
  lname,
  email,
  password,
  email_verified,
  token,
}) =>
  new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO users (fname, lname, email, password, 
        email_verified, token, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [fname, lname, email, password, email_verified, token, new Date()],
      (error, results) => {
        if (error) {
          reject(error);
        }
        return resolve(results);
      }
    );
  });

module.exports = {
  findAccountByEmail,
  findAccountByVerificationToken,
  updateAccountDetails,
  createAccount,
};
