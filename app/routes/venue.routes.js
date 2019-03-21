const express = require('express');
const router = express.Router();

const venues = require('../controllers/venue.controller');
const auth = require('../utils/auth');

router.route('/')
    .post(
        auth.checkToken,
        venues.verifyBody,
        venues.create
    );

router.route('/:venueId')
    .patch(
        auth.checkToken,
        venues.verifyVenueExists,
        venues.verifyAllowed,
        (req, res, next) => { venues.verifyBody(req, res, next,false) },
        venues.alter
    );

module.exports = router;