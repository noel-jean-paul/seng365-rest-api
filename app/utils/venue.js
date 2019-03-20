'use strict';

const utils = require('./utils');

exports.validateAttributes = (venue) => {
    // Both post and put for venues change all attributes
    const keys = [
        utils.makeKeyObject('venueName'),
        utils.makeKeyObject('categoryId', Number.isInteger, false, 'int'),
        utils.makeKeyObject('city'),
        utils.makeKeyObject('shortDescription', 'string', false),
        utils.makeKeyObject('longDescription', 'string', false),
        utils.makeKeyObject('address'),
        utils.makeKeyObject('latitude', 'number'),
        utils.makeKeyObject('longitude', 'number')
    ];

    return utils.validateAttributes(venue, keys);
};