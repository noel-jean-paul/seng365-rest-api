'use strict';

const Venue = require('../models/venue.model');
const venueUtils = require('../utils/venue');

const auth = require('../utils/auth');

exports.create = async (req, res) => {
    console.log('-----Create venue endpoint------');

    // Validate incoming data
    const errorMsg = venueUtils.validateAttributes(req.body);
    if (errorMsg) {
        res.statusMessage = "Bad Request: " + errorMsg;
        return res.status(400)
            .send();
    } else if (! (await Venue.getAllCategoryIds()).includes(req.body.categoryId)) {
        res.statusMessage = 'Bad Request: categoryId does not match any existing category';
        return res.status(400)
            .send();
    }

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