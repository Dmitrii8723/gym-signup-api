const express = require('express');
const Pool = require('pg').Pool
const { Router } = require('express');
const { json } = require('express');
const app = express();
const cors = require('cors')
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const sendVerificationLink = require('./sendgrid');

// Create db pool
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'postgres',
    port: 5432,
  });

const findAccountByEmail = async (email) => {
    return new Promise(function(resolve, reject){
     pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            reject(error)
        }
        return resolve(results.rows);
      });
    });
};

const findAccountByVerificationToken = async (token) => {
    return new Promise(function(resolve, reject){
     pool.query('SELECT * FROM users WHERE token = $1', [token], (error, results) => {
        if (error) {
            reject(error)
        }
        return resolve(results.rows);
      });
    });
};

const updateAccountDetails = async (email) => {
    return new Promise(function(resolve, reject){
        pool.query('UPDATE users SET email_verified = $1, token = $2, updated_at = $3 WHERE email = $4',
        [true, null, new Date(), email]
        , (error, results) => {
           if (error) {
               reject(error)
           }
           return resolve(results);
         });
       });
}

const createAccount = async ({ 
    fname,
    lname,
    email,
    password,
    email_verified,
    token }) => {
   return new Promise(function(resolve, reject){
    pool.query(`INSERT INTO users (fname, lname, email, password, 
        email_verified, token, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [fname, lname, email, password, 
            email_verified, token, new Date()], (error, results) => {
        if (error) {
            reject(error);
        }
        return resolve(results);
      })
    });
};

const router = new Router();
app.use(cors());

// Create account
app.use('/users', router.post('/', json(), async(req, res) => { 
    const { fname, lname, email, password } = req.body
    if (typeof email === 'string' && !validator.isEmail(email)) {
        return res.sendStatus(400);
    };

    // Check if an account with this email already exists
    const existingAccountData = await findAccountByEmail(email);
    if (existingAccountData.length > 0) {
        return res.sendStatus(409);
    };

    // Hashing password 
    const hashedPassword = bcryptjs.hashSync(password, 6);
   /*
    * Create verification token. 
    * It's stored in database till the moment user verifies his/her account
    */
    const token = crypto.randomBytes(32).toString('hex');
    await createAccount({
        fname,
        lname,
        email,
        password: hashedPassword,
        email_verified: false,
        token
    });
    sendVerificationLink(email, token);
    return res.sendStatus(200);
}));

// Verify accout
app.use('/account-verification', router.post('/:token', json(), async(req, res) => {
    const { token } = req.params
    // Check if an account with this token exists
    const existingAccountData = await findAccountByVerificationToken(token);
    if (existingAccountData.length > 0) {
        // Change email_verified to true and remove token
        await updateAccountDetails(existingAccountData[0].email);
        res.sendStatus(201)
    } else {
        res.sendStatus(404);
    }
}));

app.listen(5000, () => console.log('Server Running'));