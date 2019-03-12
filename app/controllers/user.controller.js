'use strict';

const User = require('../models/user.model');

exports.register = async (req, res) => {
    User.insert(req.body)
        .then((userId) => {
            console.log('Success');
            //res.statusMessage('Created');
            return res.status(201)
                .json( {"userId": userId} );
        })
        .catch((err) => {
            console.log('Error: ' + err);
            return res.status(400)
                .send();
        });
};