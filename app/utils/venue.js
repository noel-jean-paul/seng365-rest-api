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

exports.validateLatAndLong = (latitude, longitude) => {
  return verifyLatitude(latitude) || verifyLongitude(longitude);
};

function verifyLatitude(latitude) {
    if (latitude > 90.0) {
        return "latitude should be <= 90.0";
    } else if (latitude < -90.0) {
        return "latitude should be >= -90.0";
    } else {
        return null;
    }
}

function verifyLongitude(longitude) {
    if (longitude > 180.0) {
        return "longitude should be <= 180.0";
    } else if (longitude< -180.0) {
        return "longitude should be >= -180.0";
    } else {
        return null;
    }
}