const Chai = require('chai');

const ObjectId = require('mongoose').Types.ObjectId;
const expect = Chai.expect;
const Record = require('../../models/record.model');

describe('testing record model', () => {
  let recordId;

  describe('save new reord', () => {
    it('all required fields valid', async () => {
      try {
        const record = new Record({
          title: 'Sorry, I\'m late',
          artist: 'Kollektiv Turmstraße',
          type: 'CD',
        });

        await record.save();

        expect(record.isNew).to.be.false;

        expect(record.title).to.be.a('string');
        expect(record.title).to.equal('Sorry, I\'m late');

        expect(record.artist).to.be.a('string');
        expect(record.artist).to.equal('Kollektiv Turmstraße');

        expect(record.type).to.be.a('string');
        expect(record.type).to.equal('CD');
      } catch (err) {
        console.log(err);
      }
    });

    it('missing all required fields', async () => {
      try {
        const record = new Record();

        await record.save();
      } catch (err) {
        expect(err.errors['title'].message).to.include('Path `title` is required');
        expect(err.errors['artist'].message).to.include('Path `artist` is required');
        expect(err.errors['type'].message).to.include('Path `type` is required');
      }
    });

    it('invalid field', async () => {
      try {
        const record = new Record({
          title: 'I\'m so valid',
          artist: 'Invalid',
          type: 'Vinyl',
          xyz: 'https//localhost/',
        });

        await record.save();

        recordId = record._id;

        expect(record.isNew).to.be.false;

        expect(record.xyz).to.not.exist;
      } catch (err) {
        console.log(err);
      }
    });

    it('invalid type', async () => {
      try {
        const record = new Record({
          title: {},
          artist: {},
          type: 'NOTYPE',
        });


        await record.save();
      } catch (err) {
        expect(err.errors['title'].message).to.include('Cast to String failed');
        expect(err.errors['artist'].message).to.include('Cast to String failed');
        expect(err.errors['type'].message).to.include('is not a valid enum value for path `type`');
      }
    });
  });

  describe('update record', () => {
    it('update name and artist', async () => {
      let record = await Record.findByIdAndUpdate(recordId, {
        $set: {
          title: 'Got Updated',
          artist: 'GoUp'
        }
      }, {runValidators: true, new: true});

      expect(record.title).to.equal('Got Updated');
      expect(record.artist).to.equal('GoUp');
      expect(record.type).to.not.equal('CD');
      expect(record.type).to.equal('Vinyl');
    });

    it('remove required fields', async () => {
      try {
        let record = await Record.findByIdAndUpdate(recordId, {
          $set: {
            title: null,
            artist: null,
            type: null,
          }
        }, {runValidators: true, new: true});
      } catch (err) {
        expect(err.errors['title'].message).to.include('Path `title` is required');
        expect(err.errors['artist'].message).to.include('Path `artist` is required');
        expect(err.errors['type'].message).to.include('Path `type` is required');
      }
    });

    it('invalid field', async () => {
        let record = await Record.findByIdAndUpdate(recordId, {
          $set: {
            url: 'http://localhost/',
          }
        }, {runValidators: true, new: true});

        expect(record.isNew).to.be.false;
        expect(record.url).to.not.exist;
      }
    );
  });

  describe('delete record', () => {

  });

  describe('createRecord()', () => {
    it('create new Record and RecordList', async () => {
      const res = await Record.createRecord({
        title: 'Sorry, I\'m late',
        artist: 'Kollektiv Turmstraße',
        type: 'CD',
      });

      expect(res).to.be.an('object');

      expect(res.success).to.be.true;
      expect(res.ids).to.be.deep.an('object');
      expect(res.error).to.be.deep.an('object').that.is.empty;

      let recordId = res.ids.recordId;
      expect(ObjectId.isValid(recordId)).to.be.true;

      let recordListId = res.ids.recordListId;
      expect(ObjectId.isValid(recordListId)).to.be.true;
    });

    it('missing all required fields', async () => {
      try {
        const record = new Record();

        await record.save();
      } catch (err) {
        expect(err.errors['title'].message).to.include('Path `title` is required');
        expect(err.errors['artist'].message).to.include('Path `artist` is required');
        expect(err.errors['type'].message).to.include('Path `type` is required');
      }
    });

    it('invalid field', async () => {
      const record = new Record({
        title: 'Update Me',
        artist: 'UpMe',
        type: 'Vinyl',
        url: 'https//localhost/',
      });

      await record.save();

      recordId = record._id;

      expect(record.isNew).to.be.false;
      expect(record.url).to.not.exist;
    });

    it('invalid type', async () => {
      try {
        const record = new Record({
          title: 'No Type',
          artist: 'Invalid Type',
          type: 'NOTYPE',
        });


        await record.save();
      } catch (err) {
        expect(err.message).to.include('is not a valid enum value for path `type`');
      }
    });
  });
});
