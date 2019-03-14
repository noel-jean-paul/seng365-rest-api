const User = require('../models/user.model');

exports.checkToken = async (req, res, next) => {
    const token = req.headers['x-authorization']; // Express headers are auto converted to lowercase
    const valid = await User.verifyToken(token);   // check that token is authentic
    if (valid) {
        next();    // pass control to the next controller function
    } else {
        res.statusMessage = 'Unauthorized';
        res.status(401)
            .send();
    }
};