'use strict';

const db = require('../../config/db');
const moment = require('moment');

exports.userHasReviewedVenue = async (userId, venueId) => {
    const sql = 'SELECT review_id FROM Review WHERE reviewed_venue_id = (?) ' +
        'AND review_author_id = (?)';
    const values = [venueId, userId];

    const rows = await db.getPool().query(sql, values);

    return rows.length === 1;
};

exports.insert = async (userId, venueId, data) => {
    const timePosted = moment.utc().format('YYYY-MM-DD hh:mm:ss');

    const sql = 'INSERT INTO Review (reviewed_venue_id, review_author_id, review_body, ' +
        'star_rating, cost_rating, time_posted) VALUES (?)';
    const values = [
        [venueId, userId, data.reviewBody, data.starRating, data.costRating, timePosted]
    ];

    await db.getPool().query(sql, values);
};