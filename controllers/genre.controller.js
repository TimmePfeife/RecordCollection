const Genre = require('../models/genre.model');
const GenreList = require('../models/genrelist.model');

async function index() {
  return GenreList.index();
}

async function get(recordId) {
  return Genre.show(recordId);
}

async function post(postData) {
  return Genre.createGenre(postData);
}

async function put(id, putData) {
  return Genre.updateGenre(id, putData);
}

async function del(id) {
  return Genre.deleteGenre(id);
}

module.exports = {
  index,
  get,
  post,
  put,
  del,
};
