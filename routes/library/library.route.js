const Express = require('express');

const Router = Express.Router();

// Routes
const RecordRoute = require('./records/record.route');
const ArtistRoute = require('./artists/artist.route');

Router.use('/library', RecordRoute);
Router.use('/library', ArtistRoute);

Router.get('/library', (req, res) => {
  res.send('LIBRARY');
});

module.exports = Router;
