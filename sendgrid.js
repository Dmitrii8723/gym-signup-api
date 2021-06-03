const sendgridMail = require('@sendgrid/mail');
require('dotenv').config();

// Please, place your own apiKey
sendgridMail.setApiKey(process.env.apiKey);
/*
 * It was tested against the same email
 * (Feel free to test against any email. It's just you have to hardcode "from" email)
 */
function sendVerificationLink(email, token) {
  sendgridMail
    .send({
      to: email,
      from: email,
      subject: 'Gym platform activation link',
      html: `Please use this 
        <a href="http://localhost:1234/account-verification/${token}">verification link</a> 
        in order to verify your accout`,
    })
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((err) => console.log(err));
}

module.exports = sendVerificationLink;
