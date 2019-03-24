const express = require('express');
const router = express.Router();

const users = require('../controllers/user.controller');
const userPhotos = require('../controllers/user.photos.controller');

const reviews = require('../controllers/review.controller');


const auth = require('../utils/auth');

router.route('/')
    .post(users.register);

router.route('/login')
    .post(users.login);

router.route('/logout')
    .post(auth.checkToken, users.logout);

router.route('/:userId')
    .get((req, res, next) => { auth.checkToken(req, res, next,false) },
        users.retrieve)    // auth not always required
    .patch(auth.checkToken, users.alter);

router.route('/:userId/photo')
    .get(userPhotos.retrieve)
    .put(auth.checkToken, userPhotos.set)
    .delete(auth.checkToken, userPhotos.remove);

router.route('/:userId/reviews')
    .get(
        auth.checkToken,
        users.verifyUserExists,
        reviews.retrieveUserReviews
    );


module.exports = router;