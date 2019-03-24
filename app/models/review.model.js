'use strict';

const db = require('../../config/db');

exports.userHasReviewedVenue = async (userId, venueId) => {
    const sql = 'SELECT review_id FROM Review WHERE reviewed_venue_id = (?) ' +
        'AND review_author_id = (?)';
    const values = [venueId, userId];

    const rows = await db.getPool().query(sql, values);

    return rows.length === 1;
};