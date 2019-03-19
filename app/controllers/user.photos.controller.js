'use strict';

const UserPhotos = require('../models/user.photos.model');
const userPhotoUtils = require('../utils/user.photos');
const auth = require('../utils/auth');
const fs = require('fs');


exports.retrieve = async (req, res) => {

};

exports.set = async (req, res) => {
    const image = req.body;
    const userId = req.params.userId;

    // Validation
    if (userId !== auth.getAuthenticatedUserId()) {
        res.statusMessage = "Forbidden";
        return res.status(403)
            .send();
    }

    try {
        await fs.writeFile(`assets/users/photos/${userId}`, image);
        // save the filepath in the database
    } catch(err) {
        console.error(err);
    }
    res.status(201)
        .send();
};

exports.remove = async (req, res) => {

};