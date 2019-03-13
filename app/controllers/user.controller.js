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
    if ((req.body.username === undefined && req.body.email === undefined) ||
            req.body.password === undefined) {
        console.log('Missing fields');

        res.status(400)
            .send();
    }

    // User.login(req.body)
    //     .then((userId, token) => {
    //         return res.status(200)
    //             .json({
    //                 "userId": userId,
    //                 "token": token
    //             });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //        return res.status(400)
    //            .send();
    //     });
};