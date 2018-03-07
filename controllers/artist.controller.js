const Artist = require('../models/artist.model');
const ArtistList = require('../models/artistlist.model');

async function index() {
  return ArtistList.index();
}

async function get(recordId) {
  return Artist.show(recordId);
}

async function post(postData) {
  return Artist.createArtist(postData);
}

async function put(id, putData) {
  return Artist.updateArtist(id, putData);
}

async function del(id) {
  return Artist.deleteArtist(id);
}

module.exports = {
  index,
  get,
  post,
  put,
  del,
};
