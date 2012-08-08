var Indexer = require('../lib/indexer')
  , inspect = require('util').inspect
  , bb = require('batbelt')
  , should = require('should')
  , step = require('step')

describe('indexer', function() {
  it('should delete docs by id', function(done) {
    this.timeout(12000);

    var indexer = null
      , userDoc = {
          id: "someidindexer",
          name: "Bob Corsaro",
          interests: ["node.js", "linux", "someid_indexer"],
          thumbnail_url: "http://photos1.meetupstatic.com/photos/member/a/7/e/0/member_10782976.jpeg",
          groups: [
            {"group_id": "909090", "group_name": "Boston Javascript"},
            {"group_id": "717171", "group_name": "Boston Python"}]
        }

    step(
      function() {
        new Indexer({esServerIndex: 'heystack_test'}, this);
      },
      function(err, _indexer) {
        if (err) { this(err);  }
        else {
          indexer = _indexer;
          indexer.index(userDoc, this);
        }
      },
      function(err) {
        if (err) { this(err) }
        else {
          indexer.delete('someidindexer', this);
        }
      },
      function(err) {
        if (err) { this(err) }
        else {
          setTimeout(this, 1000);
        }
      },
      function() {
        indexer.search("someidindexer", this);
      },
      function(err, users) {
        if (err) { done(err) }
        else {
          users.length.should.eql(0);
          done(); }
      }
    );
  });

  it('should index and search', function(done) {
    this.timeout(6000);

    var indexer = null
      , userDoc = {
          id: "someidindexer",
          name: "Bob Corsaro",
          interests: ["node.js", "linux", "someid_indexer"],
          thumbnail_url: "http://photos1.meetupstatic.com/photos/member/a/7/e/0/member_10782976.jpeg",
          groups: [
            {"group_id": "909090", "group_name": "Boston Javascript"},
            {"group_id": "717171", "group_name": "Boston Python"}]
        }

    step(
      function() {
        new Indexer({esServerIndex: "heystack_test"}, this);
      },
      function(err, _indexer) {
        if (err) { this(err); }
        else {
          indexer = _indexer;
          indexer.index(userDoc, this);
        }
      },
      function(err) {
        if (err) { this(err) }
        else {
          setTimeout(this, 1000);
        }
      },
      function(err, data) {
        indexer.search("someidindexer", this);
      },
      function(err, users) {
        if (err) { this(err); }
        else {
          users.length.should.equal(1);
          users[0].id.should.equal('someidindexer');
          users[0].url.should.equal('http://www.meetup.com/members/someidindexer/');
          indexer.delete('someidindexer', this);
        }
      },
      function(err, users) {
        if (err) { this(err); }
        else { done() }
      }
    );
  });
});
