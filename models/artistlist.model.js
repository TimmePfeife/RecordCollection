const Mongoose = require('mongoose');

const { Schema } = Mongoose;

const ArtistListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  artist_src: {
    type: String,
  },
  artist_id: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
});

// Instance Methods
ArtistListSchema.statics.index = async function () {
  try {
    return await this.find({});
  } catch (err) {
    console.log(`Get ArtistList Error: ${err}`);
    return err;
  }
};

ArtistListSchema.statics.createArtistList = async function (artistListData = {}) {
  try {
    const artistList = new this(artistListData);
    await artistList.save();

    return {
      success: true,
      ids: {
        artistId: artistList.artist_id,
        artistListId: artistList._id,
      },
      error: {},
    };
  } catch (err) {
    console.log(`Create ArtistList Error: ${err}`);
    return {
      success: false,
      ids: {},
      error: err,
    };
  }
};

ArtistListSchema.statics.updateArtistList = async function (artistId, artistListData = {}) {
  try {
    await this.findOneAndUpdate({ artist_id: artistId }, { $set: artistListData }, { runValidators: true });

    return {
      success: true,
      error: {},
    };
  } catch (err) {
    console.log(`Update ArtistList Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

ArtistListSchema.statics.deleteArtistList = async function (artistId) {
  try {
    await this.findOneAndRemove({ artist_id: artistId });

    return {
      success: true,
      error: {},
    };
  } catch (err) {
    console.log(`Delete ArtistList Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

const ArtistList = Mongoose.model('ArtistList', ArtistListSchema);

module.exports = ArtistList;
