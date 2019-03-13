let jwt = require('jsonwebtoken');

exports.checkToken = async (req, res) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    // TODO : Change status codes to match api spec

    if (token) {
        try {
            const decoded = await jwt.verify(token, process.env.SECRET);
            return res.status(200)
                .send();
        } catch(err) {
            console.log(err);
            return res.status(400)
                .send();
        }
    } else {
        return res.status(401)
            .send();
    }
};