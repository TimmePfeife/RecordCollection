const Express = require('express');

const Router = Express.Router();
const Util = require('util');
const ArtistController = require('../../../controllers/artist.controller');

Router.route('/artists')
  .get(async (req, res) => {
    // get all artists
    res.json(await ArtistController.index());
  })
  .post(async (req, res) => {
    // create new artist
    res.json(await ArtistController.post(req.body));
  });

Router.route('/artists/:id([0-9a-f]{24})')
  .get(async (req, res) => {
    // get specific artist
    res.json(await ArtistController.get(req.params.id));
  })
  .patch(async (req, res) => {
    // update specific artist
    res.json(await ArtistController.patch(req.params.id, req.body));
  })
  .delete(async (req, res) => {
    // delete specific artist
    res.json(await ArtistController.del(req.params.id));
  });

module.exports = Router;
