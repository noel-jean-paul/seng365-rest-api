'use strict';

const bcrypt = require('bcrypt');

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

function validateGeneric(key, value) {
    console.log(key, value);
    if (value !== undefined) {
        if (typeof value !== 'string') {
            return `'${key}' should be a string`;
        } else if (value.length < 1) {
            return `'${key}' should NOT be shorter than 1 characters`;
        }
    } else {
        return `data should have required property '${key}'`
    }
}

// Return null if all valid or error message otherwise
// Can handle keys being passed that aren't in object
exports.validateAttributes = (user, keysToValidate) => {
    // no attributes is a bad request
    if (Object.entries(user).length === 0 && user.constructor === Object) {
        return 'no fields supplied';
    }

    const keys = ['username', 'email', 'password', 'firstName', 'lastName'];
    keysToValidate = keysToValidate || keys;

    let error = null;
    for (const key of keys) {
        if (keysToValidate.includes(key)) {
            console.log('validate generic');
            error = validateGeneric(key, user[key]);
            if (error) {
                break;
            }
        }
    }
    console.log('error is: ' + error);
    return error;
};