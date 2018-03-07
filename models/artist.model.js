const FileUpload = require('../helpers/fileupload.helper');
const Mongoose = require('mongoose');
const ArtistList = require('./artistlist.model');

const { Schema } = Mongoose;

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
  },
  artist_src: {
    type: String,
  },
  releases: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Record',
    },
  ],
});

// Instance Methods
ArtistSchema.statics.index = async function () {
  try {
    return await this.find({});
  } catch (err) {
    console.log(`Get Artists Error: ${err}`);
    return err;
  }
};

ArtistSchema.statics.show = async function (artistId) {
  try {
    return await this.findById(artistId);
  } catch (err) {
    console.log(`Get Artist Error: ${err}`);
    return err;
  }
};

ArtistSchema.statics.createArtist = async function (artistData = {}) {
  let data = artistData;

  try {
    if (data.artist_src) {
      const ret = FileUpload.saveFile(data.artist_src);
      if (!ret.success) {
        return {
          success: false,
          ids: {},
          error: ret.err,
        };
      }
      data.artist_src = ret.path;
    }

    const artist = new this(data);
    await artist.save();

    const artistListData = {
      name: artist.name,
      artist_src: artist.artist_src,
      artist_id: artist._id,
    };

    return ArtistList.createArtistList(artistListData);
  } catch (err) {
    console.log(`Create Artist Error: ${err}`);
    return {
      success: false,
      ids: {},
      error: err,
    };
  }
};

ArtistSchema.statics.updateArtist = async function (artistId, artistData = {}) {
  const data = artistData;

  try {
    if (data.artist_src) {
      const fileSrc = this.findById(artistId).artist_src;
      let ret = FileUpload.removeFile(fileSrc);
      if (!ret.success) {
        console.log(`Delete Artist Src Error: ${ret.err}`);
        return {
          success: false,
          error: ret.err,
        };
      }

      ret = FileUpload.saveFile(data.artist_src);
      if (!ret.success) {
        console.log(`Update Artist Src Error: ${ret.err}`);
        return {
          success: false,
          error: ret.err,
        };
      }
      data.cover_src = ret.path;
    }

    const artist = await this.findByIdAndUpdate(artistId, { $set: data }, { runValidators: true, new: true });

    const artistListData = {
      name: artist.name,
      artist_src: artist.artist_src,
    };

    return ArtistList.updateArtistList(artistId, artistListData);
  } catch (err) {
    console.log(`Update Artist Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

ArtistSchema.statics.deleteArtist = async function (artistId) {
  try {
    const fileSrc = this.findById(artistId).artist_src;
    const ret = FileUpload.removeFile(fileSrc);

    if (!ret.success) {
      console.log(`Delete Artist Src Error: ${ret.err}`);
      return {
        success: false,
        error: ret.err,
      };
    }

    await this.findByIdAndRemove(artistId);

    return ArtistList.deleteArtistList(artistId);
  } catch (err) {
    console.log(`Delete Artist Error: ${err}`);
    return {
      success: false,
      error: err,
    };
  }
};

const Artist = Mongoose.model('Artist', ArtistSchema);

module.exports = Artist;
