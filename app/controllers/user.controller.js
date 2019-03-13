'use strict';

const User = require('../models/user.model');

exports.register = async (req, res) => {
    User.insert(req.body)
        .then((userId) => {
            console.log('Success');
            return res.status(201)
                .json( {"userId": userId} );
        })
        .catch((err) => {
            console.log(err);
            return res.status(400)
                .send();
        });
};

exports.login = async (req, res) => {
    let token = req.getResponseHeader("x-mstr-authtoken");
    console.log(token);

    if ((req.body.username === undefined && req.body.email === undefined) ||
            req.body.password === undefined) {
        console.log('missing fields');

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