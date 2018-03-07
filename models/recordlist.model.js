const Mongoose = require('mongoose');

const { Schema } = Mongoose;

const RecordListSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  cover_src: {
    type: String,
  },
  record_id: {
    type: Schema.Types.ObjectId,
    ref: 'Record',
    required: true,
    index: true,
  },
  artist_id: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
  },
});

// Instance Methods
RecordListSchema.statics.index = async function () {
  try {
    return await this.find({});
  } catch (err) {
    console.log(`Get RecordList Error: ${err}`);
    return err;
  }
};

RecordListSchema.statics.createRecordList = async function (recordListData = {}) {
  try {
    const recordList = new this(recordListData);
    await recordList.save();

    return {
      success: true,
      ids: {
        recordId: recordList.record_id,
        recordListId: recordList._id,
      },
      error: {},
    };
  } catch (err) {
    console.log(`Create RecordList Error: ${err}`);
    return {
      success: false,
      ids: {},
      error: err,
    };
  }
};

RecordListSchema.statics.updateRecordList = async function (recordId, recordListData = {}) {
  try {
    await this.findOneAndUpdate({ record_id: recordId }, { $set: recordListData }, { runValidators: true });

    return {
      success: true,
      error: {},
    };
  } catch (err) {
    console.log(`Update RecordList Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

RecordListSchema.statics.deleteRecordList = async function (recordId) {
  try {
    await this.findOneAndRemove({ record_id: recordId });

    return {
      success: true,
      error: {},
    };
  } catch (err) {
    console.log(`Delete RecordList Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

const RecordList = Mongoose.model('RecordList', RecordListSchema);

module.exports = RecordList;
