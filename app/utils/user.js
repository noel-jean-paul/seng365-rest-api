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
      throw err;
  }
};

exports.generateToken = async function(key) {
    return jwt.sign({username: key}, process.env.SECRET);
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

// exports.validateAllBasicAttributes = (user) => {
//     const keys = Object.kets
//     const attributes = [user.givenName, user.familyName, user.password];
//     for (const attribute of attributes) {
//         const error = validateGeneric(attribute);
//         if (error) {
//             break;
//         }
//     }
//
//     return
// };