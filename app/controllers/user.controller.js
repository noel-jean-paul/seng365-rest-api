'use strict';

const User = require('../models/user.model');
const userUtils = require('../utils/user');
const auth = require('../utils/auth');

exports.register = async (req, res) => {
    console.log('-----Register user endpoint------');

    // Validate incoming data
    const errorMsg = userUtils.validateAttributes(req.body);
    if (errorMsg) {
        res.statusMessage = "Bad Request: " + errorMsg;
        return res.status(400)
            .send();
    } else if (!userUtils.validateEmail(req.body.email)) {
        res.statusMessage = 'Bad Request: data.email should match format "email"';
        return res.status(400)
            .send();
    } else if (! await User.emailAndUsernameUnique(req.body.username, req.body.email)) {
        res.statusMessage = 'Bad Request: username or email already in use';
        return res.status(400)
            .send();
    }

    try {
        const userId = await User.insert(req.body);
        res.statusMessage = 'Created';
        return res.status(201)
            .json({"userId": userId});
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};

exports.login = async (req, res) => {
    console.log('-----Login endpoint------');

    const failMessage = "Bad Request: invalid username/email/password supplied";

    if ((!req.body.username && !req.body.email) ||
            !req.body.password) {
        res.statusMessage = failMessage;
        return res.status(400)
            .send();
    }

    try {
        const result = await User.login(req.body);
        res.statusMessage = 'OK';
        return res.status(200)
            .json(result);
    } catch(err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = failMessage;
        return res.status(400)
            .send();
    }
};

exports.logout = async (req, res) => {
    console.log('-----Logout endpoint------');

    try {
        await User.logout();
        res.statusMessage = "OK";
        res.status(200)
            .send();
    } catch(err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};

exports.retrieve = async (req, res) => {
    console.log('-----Get user endpoint------');

    try {
        const userData = await User.getOne(req.params.userId, req.headers['x-authorization']);
        if (userData) {
            res.statusMessage = 'OK';
            return res.status(200)
                .json(userData);
        } else {
            res.statusMessage = 'Not Found';
            return res.status(404)
                .send();
        }
    } catch(err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};

exports.alter = async (req, res) => {
    console.log('-----Update user endpoint------');

    // validate data
    if (! await User.checkUserExists(req.params.userId)) {
        res.statusMessage = 'Not Found';
        return res.status(404)
            .send();
    } else if (req.params.userId !== auth.getAuthenticatedUserId()) {
        res.statusMessage = 'Forbidden';
        return res.status(403)
            .send();
    }

    const errorMsg = userUtils.validateAttributes(req.body,
        ["givenName", "familyName", "password"], false);    // Do not require all of these attributes
    if (errorMsg) {
        res.statusMessage = "Bad Request: " + errorMsg;
        return res.status(400)
            .send();
    }

    try {
        await User.update(req.params.userId, req.body);
        res.statusMessage = 'OK';
        return res.status(200)
            .send();
    } catch(err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};