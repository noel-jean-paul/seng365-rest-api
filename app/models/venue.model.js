'use strict';

const moment = require('moment');

const db = require('../../config/db');

//
// External helper functions
//
exports.getAllCategoryIds = async () => {
    const sql = 'SELECT category_id FROM VenueCategory';

    try {
        const rows = await db.getPool().query(sql);
        return rows.map(row => row.category_id);
    } catch (err) {
        throw err;
    }
};

exports.venueExists = async (venueId) => {
    const sql = 'SELECT venue_id FROM Venue WHERE venue_id = (?)';
    const values = [venueId];

    const rows = await db.getPool().query(sql, values);
    return rows.length === 1;
};

exports.getAdminId = async (venueId) => {
    const sql = 'SELECT admin_id FROM Venue WHERE venue_id = (?)';
    const values = [venueId];

    const rows = await db.getPool().query(sql, values);
    return rows[0].admin_id;
};


//
// 'Main' functions
//

exports.insert = async (userId, data) => {
    const sql = "INSERT INTO Venue (admin_id, category_id, venue_name, city, short_description," +
        "long_description, date_added, address, latitude, longitude) VALUES (?)";

    let dateAdded = moment.utc().format('YYYY-MM-DD');

    const values = [
        [userId, data.categoryId, data.venueName, data.city, data.shortDescription, data.longDescription,
        dateAdded, data.address, data.latitude, data.longitude]
    ];

    try {
        const result = await db.getPool().query(sql, values);
        return result.insertId;
    } catch(err) {
        throw err;
    }
};