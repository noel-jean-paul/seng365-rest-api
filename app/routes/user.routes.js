'use strict';

const users = require('../controllers/user.controller');

module.exports = (app) => {
    app.route(app.rootUrl + '/users')
        .post(users.register);

    app.route(app.rootUrl + '/users/login')
        .post(users.login);

    app.route('/users/:userId')

};