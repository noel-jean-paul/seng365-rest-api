'use strict';

const db = require('../../config/db');
const userUtils = require('../utils/user');

exports.insert = async (userData) => {
        const sql = "INSERT INTO User (username, email, given_name, family_name, password) VALUES (?)";
        userData.password = await userUtils.hashPassword(userData.password);
        const values = [
            [userData.username, userData.email, userData.givenName, userData.familyName,
                userData.password]
        ];

        try {
            const result = await db.getPool().query(sql, values);
            return result.insertId;
        } catch(err) {
            throw err;
        }
};

exports.login = async (userData) => {
    let token = jwt.sign({username: username},
        config.secret,
        { expiresIn: '24h' // expires in 24 hours
        }
    );
};