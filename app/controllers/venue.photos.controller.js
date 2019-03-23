'use strict';

const VenuePhotos = require('../models/venue.photos.model');
const venueUtils = require('../utils/venue');

const auth = require('../utils/auth');

const fs = require('fs');
const fileType = require('file-type');

const basePath = 'app/assets/users/venues/';


function verifyBodyInternal(body) {
    const errorMsg = venueUtils.validatePostPhotoAttributes(body);
    if (errorMsg) {
        return errorMsg;
    }
}

exports.verifyPostBody = async (req, res, next) => {
    const errorMsg = verifyBodyInternal(req.fields);
    if (errorMsg) {
        res.statusMessage = "Bad Request: " + errorMsg;
        return res.status(400)
            .send();
    }

    const files = req.files;
    const image = files.photo;  // always gives first photo of files uploaded
    if (image) { // Check that a png or jpeg has been included in the request
        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            res.statusMessage = 'Bad Request: image must be of type jpeg or png';
            return res.status(400)
                .send();
        }
    } else {
        res.statusMessage = 'Bad Request: No image provided';
        return res.status(400)
            .send();
    }

    next();
};

exports.addPhoto = async (req, res) => {
    console.log('--------POST venue photo endpoint--------');

    const files = req.files;
    const image = files.photo;  // always gives first photo
    const venueId = req.params.venueId;

    console.log('files are', files);

    res.status(201)
        .send();

    // // save photo
    // const path = `${basePath}${userId}`;
    // if (fs.existsSync(path)) {
    //     res.statusMessage = 'OK';
    //     res.status(200);
    // } else {
    //     res.statusMessage = 'Created';
    //     res.status(201);
    // }
    //
    // try {
    //     fs.writeFileSync(path, image);
    //     // save the filepath in the database
    //     res.send();
    // } catch(err) {
    //     if (!err.hasBeenLogged) console.error(err);
    //     res.statusMessage = 'Internal server error';
    //     return res.status(500)
    //         .send();
    // }
};