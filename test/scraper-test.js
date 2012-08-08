var assert = require("assert")
  , should = require("should")
  , scraper = require("../lib/meetup-scraper/scraper");

describe('Scraper', function(){
  describe('#request()', function(){
    it('should have received a web page', function(done){
			this.timeout(6000);
			var scraper = new Scraper();
			scraper.request("http://www.meetup.com/Node-js-in-the-wild/", 0, function(error, data) {
				//console.log(data);
				data.should.match(/All members/);
				done();
			})
    });
  });

  describe('#membersPage()', function(){
    it('should have received a list of memebers page', function(done){
			this.timeout(10000);
			var scraper = new Scraper();
			scraper.request("http://www.meetup.com/Node-js-in-the-wild/", 0, function(error, data) {
				scraper.membersPage(data, function(error, members) {
					members.length.should.equal(20);
					done();
				});
			})
    });
  });

	describe('#members()', function(){
    it('should have received all members', function(done){
			this.timeout(20000);
			var scraper = new Scraper();
			scraper.members("http://www.meetup.com/Node-js-in-the-wild/", 0, new Array(), function(error, members) {
				//console.log("found a total of "+members.length+" members");
				members.length.should.be.above(120);
				done();
			});
    });
  });

	describe('#memberDetails()', function(){
    it('should have received some member details', function(done){
			this.timeout(10000);
			var scraper = new Scraper();
			scraper.memberDetails(new Member("13879899","George"), function(error, member) {
				member.name.should.equal("George P. Stathis");
				done();
			});
    });
  });
});