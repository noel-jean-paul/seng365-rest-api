const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const allowCrossOriginRequests = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
};

module.exports = function () {
    const app = express();
    app.rootUrl = '/api/v1';

    // MIDDLEWARE
    app.use(allowCrossOriginRequests);
    app.use(bodyParser.json());
    app.use(bodyParser.raw({ type: 'text/plain' }));  // for the /executeSql endpoint
    app.use(bodyParser.raw({
        type: 'image/png',
        limit: '10mb'
    }));
    app.use(bodyParser.raw({
        type: 'image/jpeg',
        limit: '10mb'
    }));
    app.use(bodyParser.urlencoded({ // auth
        extended: true
    }));

    // ROUTES
    require('../app/routes/backdoor.routes')(app);
    require('../app/routes/user.routes')(app);
    require('../app/routes/user.photos.routes')(app);

    // DEBUG (you can remove this)
    app.get('/', function (req, res) {
        res.send({ 'message': 'Hello nbi21!' })
    });

    // Create assets folders if they do not exist
    if (!fs.existsSync('app/assets/users/photos')) {
        fs.mkdirSync('app/assets/users/photos', {recursive: true});
    }
    if (!fs.existsSync('app/assets/venues/photos')) {
        fs.mkdirSync('app/assets/venues/photos', {recursive: true});
    }

    return app;
};
