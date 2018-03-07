const Mongoose = require('mongoose');

const Artist = require('./../models/artist.model');
const ArtistList = require('./../models/artistlist.model');

const Genre = require('./../models/genre.model');
const GenreList = require('./../models/genrelist.model');

const Record = require('./../models/record.model');
const RecordList = require('./../models/recordlist.model');

process.env.NODE_ENV = 'test';

Mongoose.Promise = global.Promise;

let vr = {};
let flume = {};
let yc = {};

function createGenres() {

}

function createRecords() {
  flume.skin1 = new Record({
    title: 'Skin Companion EP I',
    artist: 'Flume',
    type: 'Vinyl',
    cover_src: 'https://upload.wikimedia.org/wikipedia/en/a/ac/Skin_Companion_EP_1_by_Flume.jpg',
    label: 'Future Classic',
    tracks: [
      {
        number: 1,
        title: 'TRUST'
      },
      {
        number: 2,
        title: 'v'
      },
      {
        number: 3,
        title: 'Heater'
      },
      {
        number: 4,
        title: 'Quirk'
      },
    ],
  });
  flume.skin1.save();

  flume.skin2 = new Record({
    title: 'Skin Companion EP II',
    artist: 'Flume',
    type: 'Vinyl',
    cover_src: 'https://upload.wikimedia.org/wikipedia/en/f/f7/Skin_Companion_EP_2_by_Flume.jpg',
    label: 'Future Classic',
    tracks: [
      {
        number: 1,
        title: 'Enough'
      },
      {
        number: 2,
        title: 'Weekend'
      },
      {
        number: 3,
        title: 'Depth Charge'
      },
      {
        number: 4,
        title: 'Fantastic'
      },
    ],
  });
  flume.skin2.save();

  yc.los = new Record({
    title: 'Los Ansterdam',
    artist: 'Yellow Claw',
    type: 'CD',
    cover_src: 'https://www.iaatm.de/wp-content/uploads/2017/04/yellowclawlosamsterdam.jpg',
    label: 'Barong Family',
    tracks: [
      {
        number: 1,
        title: 'Home',
      },
      {
        number: 2,
        title: 'Without You',
      },
      {
        number: 3,
        title: 'Love & War',
      },
      {
        number: 4,
        title: 'Good Day',
      },
      {
        number: 5,
        title: 'open',
      },
      {
        number: 6,
        title: 'City on Lockdown',
      },
      {
        number: 7,
        title: 'Friends In The Dark',
      },
      {
        number: 8,
        title: 'Stack',
      },
      {
        number: 9,
        title: 'Last Paradise',
      },
      {
        number: 10,
        title: 'Light Years',
      },
      {
        number: 11,
        title: 'Hold on To Me',
      },
      {
        number: 12,
        title: 'Rose Horizon',
      },
      {
        number: 7,
        title: 'Invitation',
      },
    ]
  });
  yc.los.save();

  vr.ger = new Record({
    title: 'German Engineering EP',
    artist: 'Virtual Riot',
    type: 'CD',
    cover_src: 'https://i1.sndcdn.com/artworks-000295322001-convtj-t500x500.jpg',
    label: 'Disciple Recordings',
    tracks: [
      {
        number: 1,
        title: 'Pray For Riddim',
      },
      {
        number: 2,
        title: 'Show Up',
      },
      {
        number: 3,
        title: 'Chop Chop',
      },
      {
        number: 4,
        title: 'Jump The Gun',
      },
      {
        number: 5,
        title: 'Komputermusik',
      },
      {
        number: 6,
        title: 'The Darkest Night',
      },
    ]
  });
  vr.ger.save();

}

function createArtists() {
  flume.flume = new Artist([
    {
      name: 'Flume',
      label: 'Future Classic',
      releases: [
        flume.skin1._id,
        flume.skin2._id,
      ],
    },
  ]);
  flume.flume.save();
}

before((done) => {
  Mongoose.connect('mongodb://localhost/record_collection_test', {useMongoClient: true});
  Mongoose.connection
    .once('open', () => {
      Mongoose.connection.db.dropDatabase();
      done();
    })
    .on('error', (err) => {
      console.warn('Error', err);
    });
});

