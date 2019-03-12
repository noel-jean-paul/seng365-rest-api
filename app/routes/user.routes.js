const users = require('../controllers/user.controller');

module.exports = (app) => {
    app.route('/users')
        .post(users.register);

    app.route('/users/:userId')

};