'use strict';

const Venue = require('../models/venue.model');
const Review = require('../models/review.model');
const venueUtils = require('../utils/venue');
const auth = require('../utils/auth');

exports.verifyAllowed = async (req, res, next) => {
    const venueId = req.params.venueId;
    const userId = auth.getAuthenticatedUserId();

    if ((await Venue.getAdminId(venueId)).toString() === userId) {
        res.statusMessage = 'Forbidden: Cannot review a venue you are the admin of';
        return res.status(403)
            .send();
    } else if (await Review.userHasReviewedVenue(userId, venueId)) {
        res.statusMessage = 'Forbidden: You have already reviewed this venue';
        return res.status(403)
            .send();
    }

    next();
};

exports.verifyPostBody = (req, res, next) => {
    const errorMsg = venueUtils.verifyReviewPostAttributes(req.body);
    if (errorMsg) {
        res.statusMessage = 'Bad Request: ' + errorMsg;
        return res.status(400)
            .send();
    }

    next();
};

exports.create = async (req, res) => {


    res.statusMessage = 'Created';
    res.status(201)
        .send();
};