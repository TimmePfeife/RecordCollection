const FileUpload = require('../helpers/fileupload.helper');
const Mongoose = require('mongoose');
const GenreList = require('./genrelist.model');

const { Schema } = Mongoose;

const GenreSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  cover_src: {
    type: String,
  },
  records: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Record',
    },
  ],
});

// Instance Methods
GenreSchema.statics.index = async function () {
  try {
    return await this.find({});
  } catch (err) {
    console.log(`Get Genres Error: ${err}`);
    return err;
  }
};

GenreSchema.statics.show = async function (genreId) {
  try {
    return await this.findById(genreId);
  } catch (err) {
    console.log(`Get Genre Error: ${err}`);
    return err;
  }
};

GenreSchema.statics.createGenre = async function (genreData = {}) {
  let data = genreData;

  try {
    if (data.cover_src) {
      const ret = FileUpload.saveFile(data.cover_src);
      if (!ret.success) {
        return {
          success: false,
          ids: {},
          error: ret.err,
        };
      }
      data.cover_src = ret.path;
    }

    const genre = new this(data);
    await genre.save();

    const genreListData = {
      name: genre.name,
      cover_src: genre.cover_src,
      genre_id: genre._id,
    };

    return GenreList.createGenreList(genreListData);
  } catch (err) {
    console.log(`Create Genre Error: ${err}`);
    return {
      success: false,
      ids: {},
      error: err,
    };
  }
};

GenreSchema.statics.updateGenre = async function (genreId, genreData = {}) {
  const data = genreData;

  try {
    if (data.cover_src) {
      const fileSrc = this.findById(genreId).cover_src;
      let ret = FileUpload.removeFile(fileSrc);
      if (!ret.success) {
        console.log(`Delete Genre Cover Src Error: ${ret.err}`);
        return {
          success: false,
          error: ret.err,
        };
      }

      ret = FileUpload.saveFile(data.cover_src);
      if (!ret.success) {
        console.log(`Update Genre Cover Src Error: ${ret.err}`);
        return {
          success: false,
          error: ret.err,
        };
      }
      data.cover_src = ret.path;
    }

    const genre = await this.findByIdAndUpdate(genreId, { $set: data }, { runValidators: true, new: true });

    const artistListData = {
      name: genre.name,
      cover_src: genre.cover_src,
    };

    return GenreList.updateGenreList(genreId, artistListData);
  } catch (err) {
    console.log(`Update Genre Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

GenreSchema.statics.deleteGenre = async function (genreId) {
  try {
    const fileSrc = this.findById(genreId).cover_src;
    const ret = FileUpload.removeFile(fileSrc);

    if (!ret.success) {
      console.log(`Delete Genre Cover Src Error: ${ret.err}`);
      return {
        success: false,
        error: ret.err,
      };
    }

    await this.findByIdAndRemove(genreId);

    return GenreList.deleteGenreList(genreId);
  } catch (err) {
    console.log(`Delete Genre Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

const Genre = Mongoose.model('Genre', GenreSchema);

module.exports = Genre;
