const Chai = require('chai');
const expect = Chai.expect;

const Artist = require('./../../models/artist.model');

describe('testing artist model', () => {
  describe('save new artist', () => {
    it('all required fields valid', async () => {
      try {
        const artist = new Artist({
          name: 'Noisia',
          label: 'Division',
        });

        await artist.save();

        expect(artist.isNew).to.be.false;

        expect(artist.name).to.be.a('string');
        expect(artist.name).to.equal('Noisia');

        expect(artist.label).to.be.a('string');
        expect(artist.label).to.equal('Division');

        expect(artist.artist_src).to.be.undefined;

        expect(artist.releases).to.be.an('array');
        expect(artist.releases).to.be.empty;
      } catch (err) {
        console.log(err);
      }
    });

    it('missing all required fields', async () => {
      try {
        const artist = new Artist({});

        await artist.save();
      } catch (err) {
        expect(err.errors['name'].message).to.include('Path `name` is required');
      }
    });

    it('invalid field', async () => {
      try {
        const artist = new Artist({
          name: 'Invalid',
          label: 'Validation',
          xyz: 'https://localhost/',
        });

        await artist.save();

        expect(artist.isNew).to.be.false;

        expect(artist.name).to.be.a('string');
        expect(artist.name).to.equal('Invalid');

        expect(artist.label).to.be.a('string');
        expect(artist.label).to.equal('Validation');

        expect(artist.artist_src).to.be.undefined;

        expect(artist.xyz).to.not.exist;
      } catch (err) {
        console.log(err);
      }
    });
  });
});
