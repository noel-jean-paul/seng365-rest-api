'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

exports.generateToken = async function(key) {
    return jwt.sign({username: key}, 'tutorial');   // not in secret as gitlab can't find the variable
};

//
// input validation
//

exports.validateEmail = function (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/;
    return re.test(email.toLowerCase());
};

function validateGeneric(attribute) {
    if (attribute) {
        if (typeof attribute === 'string') {
            return 'should be string';
        } else if (attribute.length < 1) {
            return ' should NOT be shotert than 1 characters';
        }
    }
    return null;
}

exports.validateAllBasicAttributes = (user) => {
    const keys = Object.keys(user);
    const keysToValidate = ["firstName", "familyName", "password"];

    let currentKey = null;
    for (const key of keys) {
        if (keysToValidate.includes(key)) {
            const error = validateGeneric(user[key]);
            if (error) {
                break;
            }
        }
    }
    return currentKey + ' ' + error;
};