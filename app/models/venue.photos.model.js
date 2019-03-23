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
    if (makePrimary) {
        await setIsPrimaryFalse(venueId);
        isPrimary = true;
    } else if (! await venueHasPrimaryPhoto(venueId)) {
        isPrimary = true;
    }

    return isPrimary;
}

// return true if venueId has at least 1 photo
async function venueHasPrimaryPhoto(venueId) {
    const sql = 'SELECT venue_id FROM VenuePhoto WHERE venue_id = (?) ' +
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