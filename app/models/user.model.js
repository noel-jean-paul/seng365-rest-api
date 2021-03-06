'use strict';

const db = require('../../config/db');
const userUtils = require('../utils/user');
const auth = require('../utils/auth');

// Exported helper functions

exports.checkUserExists = async (userId) => {
    const sql = 'SELECT user_id FROM User WHERE user_id = (?)';
    const values = [userId];

    const rows = await db.getPool().query(sql, values);
    return rows.length === 1;
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

exports.emailAndUsernameUnique = async (username, email) => {
    return await attributeUnique('email', email) && await attributeUnique('username', username)
};


//
// Internal helper functions
//
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

// Return true if attribute unique in db, false otherwise
// DOES NOT HANDLE ATTRIBUTES WHICH ARE NAMED DIFFERENTLY IN DB TO REQUESTS
async function attributeUnique(key, value) {
    const baseSql = 'SELECT user_id from User WHERE ';
    const sql = key + ' = (?)';
    const values = [value];

    const rows = await db.getPool().query(baseSql + sql, values);
    return rows.length === 0;
}

//
// 'Main' functions
//

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

    if (result.length === 1) {
        let validPassword = await userUtils.checkPassword(userData.password, result[0].password);
        if (validPassword) {
            let userId = result[0].user_id;
            let token = await auth.generateToken(userData.username || userData.email);
            await storeToken(userId, token);
            return {
                "userId": userId,
                "token": token
            };
        } else {
            throw new Error('Incorrect password');
        }
    } else {
        throw new Error('Username or password does not exist');
    }
};

exports.logout = async () => {
    // remove all auth tokens - need to clear current on login - easier to clear all than find current and then clear
    const sql = 'UPDATE User set auth_token = null WHERE user_id = (?)';
    const values = [auth.getAuthenticatedUserId()];
    try {
        await db.getPool().query(sql, values);
    } catch(err) {
        console.error(err);
        throw err;
    }
};

exports.getOne = async (userId) => {
   const sql = 'SELECT username, email, given_name, family_name FROM User WHERE user_id = (?)';
   const values = [userId];

   const rows = await db.getPool().query(sql, values);
   if (rows.length === 0) {
       return null;     // bad userId
   }

   let userData = rows[0];
   // transform from db names to normal names
   userData = {
       username: userData.username,
       email: userData.email,
       givenName: userData.given_name,
       familyName: userData.family_name
   };
   if (auth.getAuthenticatedUserId() === userId) {
        return userData;    // includes email
   } else {
        delete userData.email;
        return userData;
   }
};

// return true on success, false if no update occurred
exports.update = async (userId, user) => {
    const keyMap = [{
        key: "givenName",
        sqlKey: "given_name"
    },
        {
            key: "familyName",
            sqlKey: "family_name"
        },
        {
            key: "password",
            sqlKey: "password"
        }
    ];

    let updates = '';
    let values = [];

    for (let keyObj of keyMap) {
        if (Object.keys(user).includes(keyObj.key)) {
            updates += keyObj.sqlKey + ' = (?), ';
            values.push(user[keyObj.key]);
        }
    }
    updates = updates.slice(0, -2);

    const sql = 'UPDATE User SET ' + updates + ' WHERE user_id = (?)';
    values.push(userId);


    try {
        await db.getPool().query(sql, values);
    } catch(err) {
        throw err;
    }
};