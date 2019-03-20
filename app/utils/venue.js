'use strict';

const utils = require('./utils');

exports.validateAttributes = (venue, keysToValidate, allRequired=true) => {
    const keys = [
        'venueName',
        'categoryId',
        'city',
        'shortDescription',
        'longDescription'
    ];

    keysToValidate = keysToValidate || keys;


    let error = null;
    for (const key of keys) {
        if (keysToValidate.includes(key)) {
            error = utils.validateGeneric(key, venue[key], allRequired);
            if (error) {
                break;
            }
        }
    }

    // no valid attributes is a bad request (only needed for patch)
    if (!error && !utils.validFieldsProvided(user, keysToValidate)) {
        error = 'no valid fields provided';
    }

    return error;
};