'use strict';

exports.validateGeneric = function(key, value, type, required, lengthChecked=true) {
    if (value !== undefined) {
        if (typeof value !== type) {
            return `'${key}' should be a ${type}`;
        } else if (lengthChecked && value.length < 1) {
            return `'${key}' should NOT be shorter than 1 characters`;
        }
    } else if (required) {
        return `data should have required property '${key}'`
    }
    return null;
};

exports.validFieldsProvided = (obj, validKeys) => {
    for (const key of Object.keys(obj)) {
        if (validKeys.includes(key)) {
            return true;
        }
    }
    return false;
};

// Return null if all valid or error message otherwise
// Can handle keys being passed that aren't in object
// allRequired indicates that if a key in keysToValidate is missing from user then an error should
// be returned
// keys = objects
exports.validateAttributes = (user, keys, allRequired=true) => {
    let error;
    for (const key of keys) {
        error = exports.validateGeneric(key.name, user[key.name], key.type, allRequired, key.lengthChecked);
        if (error) {
            break;
        }
    }

    // no valid attributes is a bad request (only needed for patch)
    if (!error && !exports.validFieldsProvided(user, keys.map((key) => key.name))) {
        error = 'no valid fields provided';
    }

    return error;
};

exports.pickKeys = (keys, reference) => {
    return reference.filter((obj) => {return keys.includes(obj.name)});
};

exports.makeKeyObject = (name, type='string', lengthChecked=true) => {
    return {
        name: name,
        type:type,
        lengthChecked: lengthChecked
    };
};