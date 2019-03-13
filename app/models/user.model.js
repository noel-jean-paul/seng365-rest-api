'use strict';

const db = require('../../config/db');

exports.insert = async (userData) => {
    return new Promise((resolve, reject) => {

        let sql = "INSERT INTO User (username, email, given_name, family_name, password) VALUES (?)";
        let values = [
            [userData.username, userData.email, userData.givenName, userData.familyName,
                userData.password]
        ];

        db.getPool().query(sql, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.insertId);
            }
        });
    })
};