'use strict';

const utils = require('./utils');

exports.validateAttributes = (venue, allRequired) => {
    // Both post and put for venues change all attributes
    const keys = [
        utils.makeKeyObject('venueName'),
        utils.makeKeyObject('categoryId', Number.isInteger, false, 'integer'),
        utils.makeKeyObject('city'),
        utils.makeKeyObject('shortDescription', 'string', false),
        utils.makeKeyObject('longDescription', 'string', false),
        utils.makeKeyObject('address'),
        utils.makeKeyObject('latitude', 'number'),
        utils.makeKeyObject('longitude', 'number')
    ];

    return utils.validateAttributes(venue, keys, null, allRequired);
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

// Validation for get /venues

exports.validateQueryParams = (params) => {
    const keys = [
        utils.makeQueryKeyObject('count'),
        utils.makeQueryKeyObject('startIndex'),
        utils.makeQueryKeyObject('categoryId'),
        utils.makeQueryKeyObject('maxCostRating', validateCostRating),
        utils.makeQueryKeyObject('adminId'),
        utils.makeQueryKeyObject('city', validateString, 'string',
            null, null),
        utils.makeQueryKeyObject('q', validateString, 'string',
            null, null),
        utils.makeQueryKeyObject('minStarRating', (value) => {
            return checkRange(value, 1, 5)
        }),
        utils.makeQueryKeyObject('sortBy', (value) =>
            { return validateSortBy(value, params.myLatitude, params.myLongitude) },
                'string', null, null),
        utils.makeQueryKeyObject('reverseSort', null, checkReverseSortType,
        'boolean', null),
        utils.makeQueryKeyObject('myLatitude', verifyLatitude, 'number'),
        utils.makeQueryKeyObject('myLongitude', verifyLongitude, 'number')
    ];

    return utils.validateAttributes(params, keys, null, false);
};


function validateCostRating(value) {
    return checkRange(value, 0, 4);
}

function validateString(string) {
    if (parseInt(string)) {
        return 'string';    // should be string, not parsable to int
    }
}

function validateSortBy(sortBy, myLat, myLong) {
    const validValues = ['DISTANCE', 'COST_RATING', 'STAR_RATING'];
    if (!validValues.includes(sortBy)) {
        return 'should be equal to one of the allowed values';
    } else if (sortBy === 'DISTANCE' && (myLat === undefined || myLong === undefined)) {
        return 'myLatitude and myLongitude must be provided when sorting by distance';
    }
}

function checkReverseSortType(value) {
    value = value.toLowerCase();
    return value === 'true' || value === 'false';
}

// Helper funcs
function checkRange(value, lower, upper) {
    return checkGreaterThan(value, lower) || checkLessThan(value, upper);
}

function checkGreaterThan(value, bound) {
    return checkValue(value, bound, true);
}

function checkLessThan(value, bound) {
    return checkValue(value, bound, false);
}

function checkValue(value, bound, greaterThan) {
    if (greaterThan) {
        return value >= bound ? null : `>= ${bound}`;
    } else {
        return value <= bound ? null : `<= ${bound}`;
    }
}

// Distance calculation
exports.distance = (lat1, lon1, lat2, lon2) => {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km;
};


























