var Indexer = require('../lib/indexer')
  , inspect = require('util').inspect
  , should = require('should');

describe('indexer', function() {
  it('should index and search', function(done) {
    this.timeout(6000);

    new Indexer({esServerIndex: "heystack_test"}, function(err, indexer) {
      indexer.index({
        id: "someid",
        name: "Bob Corsaro",
        interests: ["node.js", "linux"],
        groups: ["Boston Javascript", "Boston Python"]
      }, function(_, data) {
        indexer.search("node.js", function(err, data) {
          data.hits.total.should.equal(1);
          data.hits.hits[0]._id.should.equal('someid');
          done();
        });
      });
    });
  });
});
