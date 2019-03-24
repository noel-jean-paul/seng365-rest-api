'use strict';

const VenuePhotos = require('../models/venue.photos.model');
const venueUtils = require('../utils/venue');

const fs = require('fs');
const fileType = require('file-type');

const basePath = 'app/assets/venues/photos';


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

function verifyBodyInternal(body) {
    const errorMsg = venueUtils.validatePostPhotoAttributes(body);
    if (errorMsg) {
        return errorMsg;
    }
}

exports.verifyPhotoBelongsToVenue = (req, res, next) => {
    const venueId = req.params.venueId;
    const photoFilename = req.params.photoFilename;

    if (venueId !== photoFilename[0]) {
        res.statusMessage = `Bad Request: Image does not belong to venue ${venueId}`;
        return res.status(404)
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

// Get photo

exports.verifyPhotoExists = async (req, res, next) => {
    if (! fs.existsSync(`${basePath}/${req.params.photoFilename}`)) {
        res.statusMessage = 'Not Found';
        return res.status(404)
            .send();
    }

    next();
};

exports.retrieve = (req, res) => {
    console.log('--------GET venue photo endpoint--------');
    const path = `${basePath}/${req.params.photoFilename}`;

    const buffer = fs.readFileSync(path);
    const type = fileType(buffer).mime;

    res.statusMessage = 'OK';
    res.contentType(type);
    res.status(200)
        .send(buffer);
};


exports.remove = async (req, res) => {
    console.log('--------DELETE venue photo endpoint--------');

    const venueId = req.params.venueId;
    const photoFilename = req.params.photoFilename;
    const path = `${basePath}/${photoFilename}`;

    // Delete photo
    try {
        fs.unlinkSync(path);
        await VenuePhotos.delete(venueId, photoFilename);   // remove from database
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

exports.setPrimary = async (req, res) => {
    console.log('--------POST Set Primary venue photo endpoint--------');

    const venueId = req.params.venueId;
    const photoFilename = req.params.photoFilename;

    try {
        await VenuePhotos.updatePrimary(venueId, photoFilename);
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
































