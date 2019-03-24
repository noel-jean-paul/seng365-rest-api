'use strict';

const moment = require('moment');

const db = require('../../config/db');
const venueUtils = require('../utils/venue');

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

exports.update = async (venueId, userId, data) => {
    const keyMap = [
        {
            key: "venueName",
            sqlKey: "venue_name"
        },
        {
            key: "categoryId",
            sqlKey: "category_id"
        },
        {
            key: "city",
        },
        {
            key: "shortDescription",
            sqlKey: "short_description"
        },
        {
            key: "shortDescription",
            sqlKey: "short_description"
        },
        {
            key: "longDescription",
            sqlKey: "long_description"
        },
        {
            key: "address",
        },
        {
            key: "latitude",
        },
        {
            key: "longitude",
        }
    ];

    let updates = '';
    let values = [];

    for (let keyObj of keyMap) {
        if (Object.keys(data).includes(keyObj.key)) {
            updates += (keyObj.sqlKey || keyObj.key) + ' = (?), ';
            values.push(data[keyObj.key]);
        }
    }
    updates = updates.slice(0, -2); // cut off trailing comma and space

    const sql = 'UPDATE Venue SET ' + updates + ' WHERE venue_id = (?)';
    values.push(venueId);


    try {
        await db.getPool().query(sql, values);
    } catch(err) {
        throw err;
    }
};


exports.getOne = async (venueId) => {
    const sql = 'SELECT * ' +
        'FROM Venue v ' +
        'natural join VenueCategory ' +
        'join User u on v.admin_id = u.user_id ' +
        'WHERE venue_id = (?)';
    const values = [venueId];

    const rows = await db.getPool().query(sql, values);

    if (rows.length === 0) {
        return null;     // bad id
    }

    const data = rows[0];
    // transform from db names to normal names
    const venueData = {
            venueName: data.venue_name,
            admin: {
                userId: data.admin_id,
                username: data.username
            },
            category: {
                categoryId: data.category_id,
                categoryName: data.category_name,
                categoryDescription: data.category_description
            },
            city: data.city,
            shortDescription: data.short_description,
            longDescription: data.long_description,
            dateAdded: data.date_added,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
            photos: []
    };

    venueData.photos = await addPhotos(venueId);

    return venueData;
};

// Modify venueData by adding photos
async function addPhotos(venueId) {
    const sql = 'SELECT photo_filename, photo_description, is_primary ' +
        'FROM Venue ' +
        'natural join VenuePhoto ' +
        'WHERE venue_id = (?)';

    const values = [venueId];
    const rows = await db.getPool().query(sql, values);

    let photo;
    let photos = [];
    for (const row of rows) {
        photo = {
            photoFilename: row.photo_filename,
            photoDescription: row.photo_description,
            isPrimary: row.is_primary === 1
        };
        photos.push(photo);
    }

    return photos;
}

exports.getCategories = async () => {
    const sql = 'SELECT * FROM VenueCategory';
    const rows = await db.getPool().query(sql);

    let categories = [];
    for (const row of rows) {
        categories.push({
           categoryId: row.category_id,
           categoryName: row.category_name,
           categoryDescription: row.category_description
        });
    }

    return categories;
};

// Get /venues

exports.getAll = async (params) => {
    const sqlData = buildQuery(params);
    const sql = sqlData.sql;
    const values = sqlData.values;

    let rows = await db.getPool().query(sql, values);

    // Calculate distance and sort by distance
    if (params.hasOwnProperty('myLatitude') && params.hasOwnProperty('myLongitude')) {
        for (let row of rows) {
            row.distance = venueUtils.distance(params.myLatitude, params.myLongitude,
                row.latitude, row.longitude);
        }
        if (params.reverseSort === 'false') {
            // default asc sort
            rows.sort((a, b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0));
        } else {
            // desc sort
            rows.sort((a, b) => (a.distance > b.distance) ? -1 : ((b.distance > a.distance) ? 1 : 0));
        }
    }

    // apply startIndex / count
    const startIndex = params.startIndex;
    if (!params.hasOwnProperty('count')) {
        rows = rows.slice(startIndex);
    } else {
        rows = rows.slice(startIndex, parseInt(startIndex) + parseInt(params.count));  // slice does not include last index
    }

    // change to res keys
    let result = [];
    let resultRow;
    for (let row of rows) {
        resultRow = {
            venueId: row.venue_id,
            venueName: row.venue_name,
            categoryId: row.category_id,
            city: row.city,
            shortDescription: row.short_description,
            longDescription: row.long_description,
            latitude: row.latitude,
            longitude: row.longitude,
            meanStarRating: row.mean_star_rating,
            modeCostRating: row.mode_cost_rating,
            primaryPhoto: row.primary_photo,
            distance: row.distance
        };
        result.push(resultRow);
    }

    return result;
};

function buildQuery(params) {
    let values = [];
    let sql = 'SELECT *, ' +
        '(SELECT mode_cost_rating FROM ModeCostRating WHERE venue_id = v1.venue_id LIMIT 1) ' +
        'as mode_cost_rating, ' +
        '(SELECT AVG(star_rating) FROM Venue v2 join Review r on v2.venue_id = r.reviewed_venue_id ' +
        'WHERE v1.venue_id = v2.venue_id) as mean_star_rating, ' +
        '(SELECT photo_filename FROM VenuePhoto vp WHERE vp.venue_id = v1.venue_id ' +
        'AND is_primary = true) as primary_photo ' +
        'FROM Venue v1 ';

    sql = addWhereStatement(params, sql, values);
    if (params.sortBy !== 'DISTANCE') { // Distance sorting handled by js later
        sql = addOrderByStatement(params, sql, values);
    }

    return {
        sql: sql,
        values: values
    }
}

function addWhereStatement(params, sql, values) {
    const whereStatements = parseWhereParams(params, values);

    let whereStatement = '';

    if (whereStatements.length > 0) {
        whereStatement += 'WHERE ' + whereStatements[0] + ' ';
        for (let i = 1; i < whereStatements.length; i++) {
            whereStatement += 'AND ' + whereStatements[i] + ' ';
        }
    }

    sql += whereStatement;

    return sql;
}

function parseWhereParams(params, values) {
    let statements = [];
    let statement;

    if (params.hasOwnProperty('categoryId')) {
        statement = 'category_id = (?)';
        statements.push(statement);
        values.push(params.categoryId);
    }

    if (params.hasOwnProperty('adminId')) {
        statement = 'admin_id = (?)';
        statements.push(statement);
        values.push(params.adminId);
    }

    if (params.hasOwnProperty('city')) {
        statement = 'city = (?)';
        statements.push(statement);
        values.push(params.city);
    }

    if (params.hasOwnProperty('q')) {
        statement = 'venue_name LIKE (?)';
        statements.push(statement);
        values.push('%' + params.q + '%');
    }

    if (params.hasOwnProperty('minStarRating')) {
        statement = '(?) <= (' +
            'SELECT AVG(star_rating) ' +
            'FROM Venue v2 ' +
            'join Review r on v2.venue_id = r.reviewed_venue_id ' +
            'WHERE v1.venue_id = v2.venue_id' +
            ')';
        statements.push(statement);
        values.push(params.minStarRating);
    }

    if (params.hasOwnProperty('maxCostRating')) {
        statement = '(?) >= (' +
            'SELECT mode_cost_rating ' +
            'FROM ModeCostRating mc ' +
            'WHERE v1.venue_id = mc.venue_id ' +
            'LIMIT 1' +
            ')';
        statements.push(statement);
        values.push(params.maxCostRating);
    }

    return statements;
}

function addOrderByStatement(params, sql) {
    if (params.hasOwnProperty('sortBy')) {
        const sortBy = params.sortBy;

        let orderByStatement = 'ORDER BY ';
        const directions = {
            STAR_RATING: {
                attribute: 'mean_star_rating',
                order: 'DESC'
            },
            COST_RATING: {
                attribute: 'mode_cost_rating',
                order: 'ASC'
            }
        };

        let orderBy = directions[sortBy].attribute;
        let orderDirection = directions[sortBy].order;

        if (params.reverseSort === 'true') {   // Flip ordering if reverse sorting
            if (orderDirection === 'DESC') {
                orderDirection = 'ASC';
            } else {
                orderDirection = 'DESC';
            }
        }

        orderByStatement += `${orderBy} ${orderDirection}`;

        sql += orderByStatement;
    }

    return sql;
}