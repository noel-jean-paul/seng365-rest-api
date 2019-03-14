const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

let authenticatedUserId;

exports.generateToken = async function(key) {
    return jwt.sign({username: key}, 'tutorial');   // not in secret as gitlab can't find the variable
};

exports.getAuthenticatedUserId = () => {
    return authenticatedUserId;
};

exports.checkToken = async (req, res, next) => {
    const token = req.headers['x-authorization']; // Express headers are auto converted to lowercase
    const userId = await User.verifyToken(token);   // check that token is authentic
    if (userId) {
        authenticatedUserId = userId;
        next();    // pass control to the next controller function
    } else {
        res.statusMessage = 'Unauthorized';
        res.status(401)
            .send();
    }
};