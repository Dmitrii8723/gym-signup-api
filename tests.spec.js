const test = require('ava');
const validator = require('validator');

// Unit tests
test('validator method pass if valid emails', t => {
    t.is(validator.isEmail('test@gmail.com'), true)
    t.is(validator.isEmail('test111@gmail.com'), true)
    t.is(validator.isEmail('testAAA@gmail.com'), true)
    t.is(validator.isEmail('testAAA111@gmail.com'), true)
    t.is(validator.isEmail('test_AAA111@gmail.com'), true)
});

test('validator method fail if invalid emails', t => {
    t.is(validator.isEmail('test@gmail'), false)
    t.is(validator.isEmail('..test@gmail.com'), false)
    t.is(validator.isEmail('>test@gmail.com'), false)
    t.is(validator.isEmail(':test@gmail.com'), false)
    t.is(validator.isEmail(']test@gmail.com'), false)
});

/*
* Since this assignment doesn't require implementing integreation tests 
* I haven't implemented ones.s
*/