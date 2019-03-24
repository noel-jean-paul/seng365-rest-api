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

exports.retrieveVenueReviews = async (req, res) => {
    const venueId = req.params.venueId;
    try {
        const result = await Review.getByVenue(venueId);
        res.statusMessage = 'OK';
        res.status(200)
            .json(result);
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};

exports.retrieveUserReviews = async (req, res) => {
    const userId = req.params.userId;
    try {
        const result = await Review.getByUser(userId);
        res.statusMessage = 'OK';
        res.status(200)
            .json(result);
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};

exports.create = async (req, res) => {
    const userId = auth.getAuthenticatedUserId();
    const venueId = req.params.venueId;
    try {
        await Review.insert(userId, venueId, req.body);
        res.statusMessage = 'Created';
        res.status(201)
            .send();
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};


