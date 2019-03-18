const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

let authenticatedUserId;

exports.generateToken = async function(key) {
    let token = jwt.sign({username: key}, 'tutorial');   // not in secret as gitlab can't find the variable
    token = (token.length > 32 ? token.slice(-32, -1) : token);    // db auth_token can hold max 32 chars
    return token;
};

exports.getAuthenticatedUserId = () => {
    return authenticatedUserId;
};

exports.checkToken = async (req, res, next, authRequired = true) => {
    const token = req.headers['x-authorization']; // Express headers are auto converted to lowercase
    console.log(token);
    const userId = await User.verifyToken(token);   // check that token is authentic
    console.log('userId:', userId);
    if (userId) {
        authenticatedUserId = userId;
        next();    // pass control to the next controller function
    } else if (authRequired) {  // some funcions do not require user authentication
        res.statusMessage = 'Unauthorized';
        res.status(401)
            .send();
    } else {
        next();
    }
};