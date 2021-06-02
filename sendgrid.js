const sendgridMail = require('@sendgrid/mail');

// Please, place your own apiKey
sendgridMail.setApiKey('');
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
    .catch((err) => console.log(err));
}

module.exports = sendVerificationLink;