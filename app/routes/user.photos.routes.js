'use strict';

const userPhotos = require('../controllers/user.photos.controller');
const auth = require('../utils/auth');

module.exports = (app) => {

    app.route(app.rootUrl + '/users/:userId/photo')
        .get(userPhotos.retrieve)
        .put(auth.checkToken, userPhotos.set)
        .delete(userPhotos.remove);
};
