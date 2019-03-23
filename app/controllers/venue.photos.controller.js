'use strict';

const VenuePhotos = require('../models/venue.photos.model');
const venueUtils = require('../utils/venue');

const fs = require('fs');

const basePath = 'app/assets/venues/photos';


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

    const body = req.fields;
    const files = req.files;
    const image = files.photo;  // always gives first photo
    const venueId = req.params.venueId;

    //console.log('files are', files);

    // save photo
    const imageName = `${venueId}_${image.name}`;
    const path = `${basePath}/${imageName}`;
    if (fs.existsSync(path)) {
        res.statusMessage = 'Bad Request: An image with the same name already exists for this venue';
        return res.status(400)
            .send();
    } else {
        res.statusMessage = 'Created';
        res.status(201);
    }

    try {
        const buffer = fs.readFileSync(image.path);
        fs.writeFileSync(path, buffer);

        // save the photo data in the database
        await VenuePhotos.savePhotoPath(venueId, imageName, body.description, body.makePrimary);

        res.send();
    } catch(err) {
        if (!err.hasBeenLogged) console.error(err);
        res.statusMessage = 'Internal server error';
        return res.status(500)
            .send();
    }
};