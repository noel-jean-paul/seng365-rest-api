'use strict';

const users = require('../controllers/user.controller');

module.exports = (app) => {
    app.route(app.rootUrl + '/users')
        .post(users.register);

    app.route('/users/:userId')

};