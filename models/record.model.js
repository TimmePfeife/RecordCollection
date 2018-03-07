const FileUpload = require('../helpers/fileupload.helper');
const Mongoose = require('mongoose');
const RecordList = require('./recordlist.model');

const { Schema } = Mongoose;

// Records schema
const RecordSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Vinyl', 'CD'],
  },
  cover_src: {
    type: String,
    // TODO: Validate Filepath
  },
  label: {
    type: String,
  },
  artist_id: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
  },
  genre_id: {
    type: Schema.Types.ObjectId,
    ref: 'Genre',
  },
  tracks: [
    {
      number: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      heading: {
        type: String,
      },
    },
  ],
});

// Instance Methods

// Statics
RecordSchema.statics.index = async function () {
  try {
    return await this.find({});
  } catch (err) {
    console.log(`Get Records Error: ${err}`);
    return err;
  }
};

RecordSchema.statics.show = async function (recordId) {
  try {
    return await this.findById(recordId);
  } catch (err) {
    console.log(`Get Record Error: ${err}`);
    return err;
  }
};

RecordSchema.statics.createRecord = async function (recordData = {}) {
  let data = recordData;

  try {
    if (data.cover_src) {
      const ret = FileUpload.saveFile(data.cover_src);
      if (!ret.success) {
        console.log(`Create Record Cover Src Error: ${ret.err}`);
        return {
          success: false,
          ids: {},
          error: ret.err,
        };
      }
      data.cover_src = ret.path;
    }

    const record = new this(data);
    await record.save();

    const recordListData = {
      title: record.title,
      artist: record.artist,
      cover_src: record.cover_src,
      artist_id: record.artist_id,
      record_id: record._id,
    };

    return RecordList.createRecordList(recordListData);
  } catch (err) {
    console.log(`Create Record Error: ${err}`);
    return {
      success: false,
      ids: {},
      error: err,
    };
  }
};

RecordSchema.statics.updateRecord = async function (recordId, recordData = {}) {
  const data = recordData;

  try {
    if (data.cover_src) {
      const fileSrc = this.findById(recordId).cover_src;
      let ret = FileUpload.removeFile(fileSrc);
      if (!ret.success) {
        console.log(`Delete Record Cover Src Error: ${ret.err}`);
        return {
          success: false,
          error: ret.err,
        };
      }

      ret = FileUpload.saveFile(data.cover_src);
      if (!ret.success) {
        console.log(`Update Record Cover Src Error: ${ret.err}`);
        return {
          success: false,
          error: ret.err,
        };
      }
      data.cover_src = ret.path;
    }

    const record = await this.findByIdAndUpdate(recordId, { $set: data }, { runValidators: true, new: true });

    const recordListData = {
      title: record.title,
      artist: record.artist,
      cover_src: record.cover_src,
      artist_id: record.artist_id,
    };

    return RecordList.updateRecordList(recordId, recordListData);
  } catch (err) {
    console.log(`Update Record Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

RecordSchema.statics.deleteRecord = async function (recordId) {
  try {
    const fileSrc = this.findById(recordId).cover_src;
    const ret = FileUpload.removeFile(fileSrc);

    if (!ret.success) {
      console.log(`Delete Record Cover Src Error: ${ret.err}`);
      return {
        success: false,
        error: ret.err,
      };
    }

    await this.findByIdAndRemove(recordId);

    return RecordList.deleteRecordList(recordId);
  } catch (err) {
    console.log(`Delete Record Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

const Record = Mongoose.model('Record', RecordSchema);

module.exports = Record;
