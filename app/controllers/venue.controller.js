'use strict';

const Venue = require('../models/venue.model');
const venueUtils = require('../utils/venue');

const auth = require('../utils/auth');

// Internal helper funcs

async function verifyBodyInternal(body, allRequired) {
    const errorMsg = venueUtils.validateAttributes(body, allRequired) ||
        venueUtils.validateLatAndLong(body.latitude, body.longitude);
    if (errorMsg) {
        return errorMsg;
    } else if (body.categoryId && ! (await Venue.getAllCategoryIds()).includes(body.categoryId)) {
        return 'categoryId does not match any existing category';
    }
}


// External helper funcs
exports.verifyVenueExists = async (req, res, next) => {
    if (! await Venue.venueExists(req.params.venueId)) {
        res.statusMessage = 'Not Found';
        return res.status(404)
            .send();
    }
    next();
};

exports.verifyAllowed = async (req, res, next) => {
    if ((await Venue.getAdminId(req.params.venueId)).toString() !== auth.getAuthenticatedUserId()) {
        res.statusMessage = 'Forbidden';
        return res.status(403)
            .send();
    }
    next();
};

exports.verifyBody= async (req, res, next, allRequired=true) => {
    const errorMsg = await verifyBodyInternal(req.body, allRequired);
    if (errorMsg) {
        res.statusMessage = "Bad Request: " + errorMsg;
        return res.status(400)
            .send();
    }
    next();
};


// Main funcs

exports.create = async (req, res) => {
    console.log('-----Create venue endpoint------');

    const userId = auth.getAuthenticatedUserId();
    try {
        const venueId = await Venue.insert(userId, req.body);
        res.statusMessage = 'Created';
        return res.status(201)
            .json({"venueId": venueId});
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};

exports.alter = async (req, res) => {
    console.log('-----Update venue endpoint------');

    const venueId = req.params.venueId;
    const userId = auth.getAuthenticatedUserId();

    try {
        await Venue.update(venueId, userId, req.body);
        res.statusMessage = 'OK';
        return res.status(200)
            .send();
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};

exports.retrieve = async (req, res) => {
    console.log('-----Get Single Venue endpoint------');

    try {
        const venue = await Venue.getOne(req.params.venueId);
        if (venue) {
            res.statusMessage = 'OK';
            return res.status(200)
                .json(venue);
        } else {
            res.statusMessage = 'Not Found';
            return res.status(404)
                .send();
        }
    } catch(err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};

exports.retrieveCategories = async (req, res) => {
    console.log('--------Get categories endpoint--------');

    try {
        const categories = await Venue.getCategories();
        res.statusMessage = 'OK';
        return res.status(200)
            .json(categories);
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};

// Get /venues
exports.verifyQueryParams = (req, res, next) => {
    const params = req.query;

    const errorMessage = venueUtils.validateQueryParams(params);
    if (errorMessage) {
        res.statusMessage = `Bad Request: ${errorMessage}`;
        res.status(400)
            .send();
    }

    next();
};

exports.setQueryDefaults = (req, res, next) => {
    const params = req.query;
    if (params.startIndex === undefined) {
        params.startIndex = '0';
    }
    if (params.sortBy === undefined) {
        params.sortBy = 'STAR_RATING';
    }
    if (params.reverseSort === undefined) {
        params.reverseSort = 'false';
    }
    next();
};

exports.retrieveAll = async (req, res) => {
    console.log(req.query);
    try {
        const result = await Venue.getAll(req.query);
        // Take startIndex/count rows
        return res.status(200)
            .json(result);
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};


























