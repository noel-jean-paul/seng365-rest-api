const venues = require('../controllers/venue.controller');

module.exports = (app) => {
    // DEBUG
    app.get(app.rootUrl + '/', function (req, res) {
        res.send({ 'message': 'Hello nbi21!' })
    });

    app.use(app.rootUrl + '/', require('./backdoor.routes'));
    app.use(app.rootUrl + '/users', require('./user.routes'));
    app.use(app.rootUrl + '/venues', require('./venue.routes'));

    app.route(app.rootUrl + '/categories')
        .get(venues.retrieveCategories);

    // Catch all
    app.use('*', function (req, res){
        res.status(404).json({err: "Path" + req.originalUrl
                + " does not exist"});
    });
};