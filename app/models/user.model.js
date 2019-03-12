const db = require('../../config/db');

exports.insert = async (username, givenName, familyName, email, password) => {
    return new Promise((resolve, reject) => {

        let sql = "INSERT INTO User (username, email, given_name, family_name, password) VALUES (?)";
        let values = [
            [username, email, givenName, familyName, password]
        ];

        db.getPool().query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                reject({"ERROR": "Error inserting"});
            } else {
                resolve(result);
            }
        });
    })
};