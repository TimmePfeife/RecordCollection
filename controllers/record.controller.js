const Record = require('../models/record.model');
const RecordList = require('../models/recordlist.model');

async function index() {
  return RecordList.index();
}

async function get(recordId) {
  return Record.show(recordId);
}

async function post(postData) {
  return Record.createRecord(postData);
}

async function put(id, putData) {
  return Record.updateRecord(id, putData);
}

async function del(id) {
  return Record.deleteRecord(id);
}

module.exports = {
  index,
  get,
  post,
  put,
  del,
};
