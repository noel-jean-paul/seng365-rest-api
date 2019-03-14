'use strict';

const users = require('../controllers/user.controller');
const auth = require('../utils/auth');

module.exports = (app) => {
    app.route(app.rootUrl + '/users')
        .post(users.register);

    app.route(app.rootUrl + '/users/login')
        .post(users.login);

    app.route(app.rootUrl + '/users/logout')
        .post(auth.checkToken, users.logout);
};