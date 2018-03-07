const Express = require('express');

const Router = Express.Router();
const Util = require('util');
const GenreController = require('../../controllers/genre.controller');

Router.route('/genres')
  .get(async (req, res) => {
    // get all genres
    res.json(await GenreController.index());
  });

Router.route('/genre')
  .post(async (req, res) => {
    // create new genre
    res.json(await GenreController.post(req.body));
  });

Router.route('/genre/:id([0-9a-f]{24})')
  .get(async (req, res) => {
    // get specific genre
    res.json(await GenreController.get(req.params.id));
  })
  .put(async (req, res) => {
    // update specific genre
    res.json(await GenreController.put(req.params.id, req.body));
  })
  .delete(async (req, res) => {
    // delete specific genre
    res.json(await GenreController.del(req.params.id));
  });

module.exports = Router;
