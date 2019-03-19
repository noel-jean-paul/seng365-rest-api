'use strict';

const UserPhotos = require('../models/user.photos.model');
const User = require('../models/user.model');

const userPhotoUtils = require('../utils/user.photos');
const auth = require('../utils/auth');

const fs = require('fs');
const fileType = require('file-type');

const basePath = 'app/assets/users/photos/';


exports.retrieve = async (req, res) => {
    console.log('--------GET user photo endpoint--------');

    const path = `${basePath}${req.params.userId}`;

    // Validation
    if (!fs.existsSync(path)) {     // Covers userId not existing and user not having a photo
        res.statusMessage = 'Not Found';
        return res.status(404)
            .send();
    }

    try {
        const buffer = fs.readFileSync(path);
        const type = fileType(buffer).mime;
        res.statusMessage = 'OK';
        res.contentType(type);
        res.status(200)
            .send(buffer);

    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal Server Error';
        return res.status(500)
            .send();
    }
};

exports.set = async (req, res) => {
    console.log('--------PUT user photo endpoint--------');

    const image = req.body;
    const userId = req.params.userId;

    // Validation
    if (! await User.checkUserExists(userId)) {
        res.statusMessage = 'Not Found';
        return res.status(404)
            .send();
    } else if (userId !== auth.getAuthenticatedUserId()) {
        res.statusMessage = "Forbidden";
        return res.status(403)
            .send();
    } else if (image) { // Check that a png or jpeg has been included in the request
        const imgType = fileType(image) ? fileType(image).ext : '';
        if (imgType !== 'jpg' && imgType !== 'png') {   // fileType give jpg not jpeg
            res.statusMessage = 'Bad Request';
            return res.status(400)
                .send();
        }
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
    console.log('--------PUT user photo endpoint--------');

    const userId = req.params.userId;
    const path = `${basePath}${userId}`;

    // Validation
    if (!await User.checkUserExists(userId)) {
        res.statusMessage = 'Not Found';
        return res.status(404)
            .send();
    } else if (userId !== auth.getAuthenticatedUserId()) {
        res.statusMessage = "Forbidden";
        return res.status(403)
            .send();
    } else if (!fs.existsSync(path)) {     // user not having a photo case
        res.statusMessage = 'Not Found';
        return res.status(404)
            .send();
    }

    // Delete photo
    try {
        fs.unlinkSync(path);
        res.statusMessage = 'OK';
        res.status(200)
            .send();
    } catch (err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};