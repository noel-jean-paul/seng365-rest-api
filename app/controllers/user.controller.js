const User = require('../models/user.model');

exports.register = (req, res) => {
    User.insert(req.body.username, req.body, req.body.givenName, req.body.familyName,
        req.body.email, req.body.password)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.json(err);
        });
};