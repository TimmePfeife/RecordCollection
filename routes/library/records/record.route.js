const Express = require('express');

const Router = Express.Router();
const Util = require('util');
const RecordController = require('../../../controllers/record.controller');

Router.route('/records')
  .get(async (req, res) => {
    // get all records
    res.json(await RecordController.index());
  })
  .post(async (req, res) => {
    // create new record
    res.json(await RecordController.post(req.body));
  });

Router.route('/records/:id([0-9a-f]{24})')
  .get(async (req, res) => {
    // get specific record
    res.json(await RecordController.get(req.params.id));
  })
  .patch(async (req, res) => {
    // update specific record
    res.json(await RecordController.patch(req.params.id, req.body));
  })
  .delete(async (req, res) => {
    // delete specific record
    res.json(await RecordController.del(req.params.id));
  });

module.exports = Router;
