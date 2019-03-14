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
    let sql;
    let values;
    const baseSql = 'SELECT user_id, password from User where ';

    if (userData.email) {
        sql = baseSql + 'email = (?)';
        values = [userData.email];
    } else {
        sql = baseSql + 'username = (?)';
        values = [userData.username];
    }

    let result;
    try {
        result = await db.getPool().query(sql, values);
    } catch (err) {
        throw err;
    }

    if (userUtils.checkPassword(userData.password, result[0].password)) {
        // Clear current token
        await exports.logout();

        let userId = result[0].user_id;
        let token = await userUtils.generateToken(userData.username || userData.email);
        token = (token.length > 32 ? token.slice(0, 32) : token);    // db auth_token can hold max 32 chars
        await storeToken(userId, token);
        return {
            "userId": userId,
            "token": token
        };
    } else {
        throw new Error('Invalid password')
    }
};

async function storeToken(userId, token) {
       const sql = 'UPDATE User set auth_token = (?) where user_id = (?)';
       const values = [token, userId];

       try {
           await db.getPool().query(sql, values);
       } catch(err) {
           console.error(err);
           throw err;
       }
}

exports.logout = async () => {
    // remove all auth tokens - need to clear current on login - easier to clear all than find current and then clear
    const sql = 'UPDATE User set auth_token = null';

    try {
        await db.getPool().query(sql);
    } catch(err) {
        console.error(err);
        throw err;
    }
};

// Return the user_id (as a String) matching the token if valid, null otherwise
exports.verifyToken = async (token) => {
    const sql = 'SELECT user_id from User where auth_token = (?)';
    const values = [token];

    try {
        const rows = await db.getPool().query(sql, values);
        if (rows.length === 1) {
            return rows[0].user_id.toString();  // return as string to match with url params
        } else {
            return null;
        }
    } catch(err) {
        console.error(err);
        throw err;
    }
};

// Check if userId matches the user_id associated with the token
// Return true if so, false otherwise.
async function userIsAuthenticated(userId, token) {
    const authenticatedUser = await exports.verifyToken(token);
    return authenticatedUser === userId;
}

exports.getOne = async (userId, token) => {
   const sql = 'SELECT username, email, given_name, family_name FROM User WHERE user_id = (?)';
   const values = [userId];

   const rows = await db.getPool().query(sql, values);
   if (rows.length === 0) {
       return null;     // bad userId
   }

   const userData = rows[0];
   const includeEmail = await userIsAuthenticated(userId, token);
   if (includeEmail) {
        return userData;    // includes email
   } else {
       delete userData.email;
        return userData;
   }
};