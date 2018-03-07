const Express = require('express');

const App = Express();
const Mongoose = require('mongoose');
// Mongoose.Promise = Promise;
const BodyParser = require('body-parser');
// Debug
const Util = require('util');

Mongoose.connect('mongodb://localhost/record_collection', { useMongoClient: true });
const DB = Mongoose.connection;

DB.once('open', () => {
  console.log('Connected to MongoDB');
});

DB.on('error', (err) => {
  console.log(`DB Error: ${err}`);
});

// Middleware
App.use(BodyParser.json());
App.use(BodyParser.urlencoded({ extended: false }));

// Routes
const LibraryRoute = require('./routes/library/library.route');
const GenreRoute = require('./routes/genre/genre.route');

App.use('/', LibraryRoute);
App.use('/', GenreRoute);

App.get('/', (req, res) => {
  res.send('INDEX');
});

const { saveFile } = require('./helpers/fileupload.helper');

App.post('/test', (req, res) => {
  res.send(saveFile(req.body.file));
});

App.listen(8080, () => {
  console.log('Server started on port 8080');
});
