const express = require('express');
const router = express.Router();

const venues = require('../controllers/venue.controller');
const auth = require('../utils/auth');

router.route('/')
    .post(auth.checkToken, venues.create);

module.exports = router;