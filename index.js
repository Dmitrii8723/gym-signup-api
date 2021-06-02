const express = require('express');
const { Router } = require('express');
const { json } = require('express');
const app = express();
const cors = require('cors')
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const sendVerificationLink = require('./sendgrid');
const { 
    findAccountByEmail,
    findAccountByVerificationToken,
    updateAccountDetails,
    createAccount 
} = require('./model');

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

// Verify account
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