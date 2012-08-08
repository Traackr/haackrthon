var bb = require('batbelt');
var Scraper = require('./meetup-scraper/scraper');
var Indexer = require('./indexer');

function BatchJobs() {
}

BatchJobs.prototype.crawlMeetup = function(url, fn) {

    function handler(error, response) {
    	if (error) {
    		console.error(error.stack);
    		console.log("Failed batch-job crawlMeetup w/URL = " + url);
    	} else {

    		var indexer = new Indexer();
    		response.map(function(member) {
    			var mem = {
    				id: member.id,
    				name: member.name
    			};
    		}).forEach(function(member) {
    			indexer.index(member, function(error) {
    				if (error) {
    					console.error(error.stack);
    				}
    			});
    		});
    	}
    }

	var meetupScraper = new Scraper();
	meetupScraper.findMembers(url, handler);
	fn(null, {"status": "started"});
}

exports = module.exports = BatchJobs;
