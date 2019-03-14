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

function validateGeneric(attribute) {
    if (attribute !== undefined) {
        if (typeof attribute !== 'string') {
            return 'should be a string';
        } else if (attribute.length < 1) {
            return ' should NOT be shorter than 1 characters';
        }
    }
    return null;
}

// Return null if all valid or error message otherwise
// Can handle keys being passed that aren't in object
exports.validateAttributes = (user, keysToValidate) => {
    // no attributes is a bad request
    if (Object.entries(user).length === 0 && user.constructor === Object) {
        return 'no fields supplied';
    }

    const keys = Object.keys(user);
    keysToValidate = keysToValidate || ["firstName", "familyName", "password"]; // default

    let error = '';
    let errorKey = null;
    for (const key of keys) {
        if (keysToValidate.includes(key)) {
            error = validateGeneric(user[key]);
            if (error) {
                errorKey = key;
                break;
            }
        }
    }
    return (error ? errorKey + ' ' + error : null);
};