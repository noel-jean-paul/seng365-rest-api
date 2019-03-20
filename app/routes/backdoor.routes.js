const express = require('express');
const router = express.Router();

const backdoor = require('../controllers/backdoor.controller');

router.route('/reset')
    .post(backdoor.resetDB);

router.route('/resample')
    .post(backdoor.resample);

router.route('/executeSql')
    .post(backdoor.executeSql);

module.exports = router;