'use strict';

const db = require('../../config/db');

exports.savePhotoPath = async (venueId, path, description, makePrimary) => {
    const sql = 'INSERT INTO VenuePhoto (venue_id, photo_filename, ' +
        'photo_description, is_primary) VALUES (?)';
    let values = [
        [venueId, path, description]
    ];

    // Determine primary
    const isPrimary = await determinePrimary(venueId, makePrimary);
    values[0].push(isPrimary);

    await db.getPool().query(sql, values);
};

// determine and action primary
async function determinePrimary(venueId, makePrimary) {
    let isPrimary = false;
    if (makePrimary === 'true') {
        await setIsPrimaryFalse(venueId);
        isPrimary = true;
    } else if (! await venueHasPrimaryPhoto(venueId)) {
        isPrimary = true;
    }

    return isPrimary;
}

// return true if venueId has at least 1 photo
async function venueHasPrimaryPhoto(venueId) {
    const sql = 'SELECT venue_id, is_primary FROM VenuePhoto WHERE venue_id = (?) ' +
        'AND is_primary = true';
    const values = [venueId];

    const rows = await db.getPool().query(sql, values);
    return rows.length === 1;
}

// set is primary false for all photos belonging to venueId
async function setIsPrimaryFalse(venueId) {
    const sql = 'UPDATE VenuePhoto SET is_primary = false WHERE is_primary = true ' +
        'AND venue_id = (?)';
    const values = [venueId];

    await db.getPool().query(sql, values);
}


// Delete

exports.delete = async (venueId, photoFilename) => {
    const isPrimary = await isPrimaryPhoto(photoFilename);

    // delete the photo
    const sql = 'DELETE FROM VenuePhoto WHERE photo_filename = (?)';
    const values = [photoFilename];

    await db.getPool().query(sql, values);

    // choose a new primary photo if we just deleted the current one
    if (isPrimary) {
        await setNewPrimary(venueId);
    }
};

async function isPrimaryPhoto(photoFilename) {
    const sql = 'SELECT is_primary FROM VenuePhoto WHERE photo_filename = (?)';
    const values = [photoFilename];

    const rows = await db.getPool().query(sql, values);
    return rows.length === 1;
}

async function setNewPrimary(venueId) {
    const sql = 'SELECT photo_filename FROM VenuePhoto WHERE venue_id = (?)';
    const values = [venueId];
    const rows = await db.getPool().query(sql, values);

    // set a new primary if the venue has other photos
    if (rows.length > 0) {
        await setPrimary(rows[0].photo_filename);
    }
}

async function setPrimary(photoFilename) {
    const sql = 'UPDATE VenuePhoto SET is_primary = true WHERE photo_filename = (?)';
    const values = [photoFilename];
    await db.getPool().query(sql, values);
}

















