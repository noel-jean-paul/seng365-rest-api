'use strict';

const moment = require('moment');

const db = require('../../config/db');

//
// Internal helper functions
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


//
// 'Main' functions
//

exports.insert = async (userId, data) => {
    const sql = "INSERT INTO Venue (admin_id, category_id, venue_name, city, short_description," +
        "long_description, date_added, address, latitude, longitude) VALUES (?)";

    let dateAdded = moment.utc().format('YYYY-MM-DDT00:00:00.000') + 'Z';
    console.log(dateAdded);

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