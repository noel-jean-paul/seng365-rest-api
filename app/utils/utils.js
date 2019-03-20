'use strict';

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

exports.validateGeneric = function(key, value, type, required, lengthChecked=true, backupType) {
    if (value !== undefined) {
        if (isFunction(type) && !type(value)) { // may get passed a func for type checking
            return `'${key}' should be a ${backupType}`;
        } else if (!isFunction(type) && typeof value !== type) {
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


exports.validateAttributes = (obj, keys, keysToValidate, allRequired=true) => {
    // revert to defaults if needed
    keysToValidate = keysToValidate || keys.map((key) => key.name);

    keysToValidate = pickKeys(keysToValidate, keys);

    return validateAttributesInternal(obj, keysToValidate, allRequired);
};

// Return null if all valid or error message otherwise
// Can handle keys being passed that aren't in object
// allRequired indicates that if a key in keysToValidate is missing from user then an error should
// be returned
// keys = objects
function validateAttributesInternal(obj, keys, allRequired=true) {
    let error;
    for (const key of keys) {
        error = exports.validateGeneric(key.name, obj[key.name], key.type, allRequired, key.lengthChecked);
        if (error) {
            break;
        }
    }

    // no valid attributes is a bad request (only needed for patch)
    if (!error && !exports.validFieldsProvided(obj, keys.map((key) => key.name))) {
        error = 'no valid fields provided';
    }

    return error;
}

function pickKeys(keys, reference) {
    return reference.filter((obj) => {return keys.includes(obj.name)});
}

exports.makeKeyObject = (name, type='string', lengthChecked=true, backupType) => {
    return {
        name: name,
        type:type,
        lengthChecked: lengthChecked,
        backupType: backupType
    };
};