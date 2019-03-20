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
    }
};