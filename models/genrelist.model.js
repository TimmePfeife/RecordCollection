const Mongoose = require('mongoose');

const { Schema } = Mongoose;

const GenreListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cover_src: {
    type: String,
  },
  genre_id: {
    type: Schema.Types.ObjectId,
    ref: 'Genre',
    required: true,
  },
});

// Instance Methods
GenreListSchema.statics.index = async function () {
  try {
    return await this.find({});
  } catch (err) {
    console.log(`Get GenreList Error: ${err}`);
    return err;
  }
};

GenreListSchema.statics.createGenreList = async function (GenreListData = {}) {
  try {
    const GenreList = new this(GenreListData);
    await GenreList.save();

    return {
      success: true,
      ids: {
        genreId: GenreList.genre_id,
        GenreListId: GenreList._id,
      },
      error: {},
    };
  } catch (err) {
    console.log(`Create GenreList Error: ${err}`);
    return {
      success: false,
      ids: {},
      error: err,
    };
  }
};

GenreListSchema.statics.updateGenreList = async function (genreId, GenreListData = {}) {
  try {
    await this.findOneAndUpdate({ genre_id: genreId }, { $set: GenreListData }, { runValidators: true });

    return {
      success: true,
      error: {},
    };
  } catch (err) {
    console.log(`Update GenreList Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

GenreListSchema.statics.deleteGenreList = async function (genreId) {
  try {
    await this.findOneAndRemove({ genre_id: genreId });

    return {
      success: true,
      error: {},
    };
  } catch (err) {
    console.log(`Delete GenreList Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

const GenreList = Mongoose.model('GenreList', GenreListSchema);

module.exports = GenreList;
