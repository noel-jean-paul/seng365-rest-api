'use strict';

const User = require('../models/user.model');

exports.register = async (req, res) => {
    try {
        let userId = await User.insert(req.body);
        console.log('Success');
        res.statusMessage = 'Created';
        res.status(201)
            .json( {"userId": userId} );
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Bad Request';
        res.status(400)
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