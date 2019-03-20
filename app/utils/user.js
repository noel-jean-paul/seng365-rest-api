'use strict';

const bcrypt = require('bcrypt');

const utils = require('./utils');

//
// passwords
//

exports.hashPassword = async function(plaintextPassword) {
    const saltRounds = 7;
    try {
        return await bcrypt.hash(plaintextPassword, saltRounds);
    } catch(err) {
        console.error(err);
    }
};

exports.checkPassword = async function(plaintextPassword, hashedPassword) {
  try {
      return await bcrypt.compare(plaintextPassword, hashedPassword);
  } catch(err) {
      console.error(err);
  }
};

//
// input validation
//

exports.validateEmail = function (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/;
    return re.test(email.toLowerCase());
};



// Return null if all valid or error message otherwise
// Can handle keys being passed that aren't in object
// allRequired indicates that if a key in keysToValidate is missing from user then an error should
// be returned
exports.validateAttributes = (user, keysToValidate, allRequired=true) => {
    const keys = [
        utils.makeKeyObject('username'),
        utils.makeKeyObject('email'),
        utils.makeKeyObject('password'),
        utils.makeKeyObject('givenName'),
        utils.makeKeyObject('familyName')
    ];

    return utils.validateAttributes(user, keys, keysToValidate, allRequired);
};



