const express = require('express');
const router = express.Router();

const venues = require('../controllers/venue.controller');
const venuePhotos = require('../controllers/venue.photos.controller');
const reviews = require('../controllers/review.controller');

const auth = require('../utils/auth');

const formidable = require('express-formidable');

router.route('/')
    .get(
        venues.verifyQueryParams,
        venues.setQueryDefaults,
        venues.retrieveAll
    )
    .post(
        auth.checkToken,
        venues.verifyBody,
        venues.create
    );

router.route('/:venueId')
    .get(
        venues.verifyVenueExists,
        venues.retrieve
    )

    .patch(
        auth.checkToken,
        venues.verifyVenueExists,
        venues.verifyAllowed,
        (req, res, next) => { venues.verifyBody(req, res, next,false) },
        venues.alter
    );

router.route('/:venueId/photos')
    .post(
        auth.checkToken,
        venues.verifyVenueExists,
        venues.verifyAllowed,
        formidable(),
        venuePhotos.verifyPostBody,
        venuePhotos.addPhoto
    );

router.route('/:venueId/photos/:photoFilename')
    .get(
        venues.verifyVenueExists,
        venuePhotos.verifyPhotoExists,
        venuePhotos.verifyPhotoBelongsToVenue,
        venuePhotos.retrieve
    )

    .delete(
        auth.checkToken,
        venues.verifyVenueExists,
        venuePhotos.verifyPhotoExists,
        venuePhotos.verifyPhotoBelongsToVenue,
        venues.verifyAllowed,
        venuePhotos.remove
    );

router.route('/:venueId/photos/:photoFilename/setPrimary')
    .post(
        auth.checkToken,
        venues.verifyVenueExists,
        venuePhotos.verifyPhotoExists,
        venuePhotos.verifyPhotoBelongsToVenue,
        venues.verifyAllowed,
        venuePhotos.setPrimary
    );



router.route('/:venueId/reviews')
    .post(
        auth.checkToken,
        venues.verifyVenueExists,
        reviews.verifyAllowed,
        reviews.verifyPostBody,
        reviews.create
    );


module.exports = router;