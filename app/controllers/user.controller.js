'use strict';

const User = require('../models/user.model');
const userUtils = require('../utils/user');

exports.register = async (req, res) => {
    if (!userUtils.validateEmail(req.body.email)) {
        res.statusMessage = 'Bad Request: data.email should match format "email"';
        return res.status(400)
            .send();
    } else if (req.body.password.length === 0) {
        res.statusMessage = 'Bad Request: data.password should NOT be shorter than 1 characters';
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
        res.statusMessage = 'Bad Request: username or email already in use';
        return res.status(400)
            .send();
    }
};

exports.login = async (req, res) => {
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
    console.log('logging out');
    try {
        await User.logout();
        res.statusMessage = "OK";
        res.status(200)
            .send();
    } catch(err) {
        if (!err.hasBeenLogged) console.error(err);
    }
};

exports.retrieve = async (req, res) => {
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
    }
};

exports.alter = async (req, res) => {
    try {
        await User.update(req.params.userId);
    } catch {

    }
};