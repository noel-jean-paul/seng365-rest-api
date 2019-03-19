'use strict';

const UserPhotos = require('../models/user.photos.model');
const User = require('../models/user.model');
const userPhotoUtils = require('../utils/user.photos');

const auth = require('../utils/auth');
const fs = require('fs');

const basePath = 'app/assets/users/photos/';


exports.retrieve = async (req, res) => {

};

exports.set = async (req, res) => {
    const image = req.body;
    const userId = req.params.userId;

    // Validation
    if (!User.checkUserExists(userId)) {
        res.statusMessage = 'Not Found';
        return res.status(404)
            .send();
    } else if (userId !== auth.getAuthenticatedUserId()) {
        res.statusMessage = "Forbidden";
        return res.status(403)
            .send();
    } else if (!image) {
        res.statusMessage = 'Bad Request';
        return res.status(400)
            .send();
    }

    // save photo
    const path = `${basePath}${userId}`;
    if (fs.existsSync(path)) {
        res.statusMessage = 'OK';
        res.status(200);
    } else {
        res.statusMessage = 'Created';
        res.status(201);
    }

    try {
        fs.writeFileSync(path, image);
        // save the filepath in the database
        res.send();
    } catch(err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};

exports.remove = async (req, res) => {

};