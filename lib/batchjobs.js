var bb = require('batbelt');
var Scraper = require('./meetup-scraper/scraper');
var Indexer = require('./indexer');

function BatchJobs() {}

BatchJobs.prototype.crawlMeetup = function(url, fn) {

  var meetupScraper = new Scraper();
  var indexer = new Indexer();

  function handler(error, response) {
    if (error) {
      console.error(error.stack);
      console.log("Failed batch-job crawlMeetup w/URL = " + url);
    } else {
      console.log("Got members response back: " + response.length);
      response.forEach(function(member) {
        meetupScraper.memberDetails(member, function(error, resp2) {
          console.log("Augmenting user data for id: " + member.id);
          var doc = {
            id: resp2.id,
            name: resp2.name,
            thumbnail_url: resp2.avatar,
            interests: resp2.interests,
            groups: resp2.groups.map(function(group) {
              return {group_id: group.url, group_name: group.name};
            })
          };

          indexer.index(doc, function(error) {
            if (error) {
              console.error(error.stack);
            }
          });
        });
      });
    }
  }

	meetupScraper.members(url, 0, [], handler);
	fn(null, {"status": "started"});
}

BatchJobs.prototype.augmentUsers = function(fn) {

  function handler(error, usersIds) {
    if (error) {
      console.error(error.stack);
      console.log("Failed batch-job crawlUsers");
    } else {
      userIds.map(function(member) {
        return {
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

	var indexer = new Indexer();
	index.findAllUserIds(handler);

	fn(null, {"status": "started"});
}

exports = module.exports = BatchJobs;
