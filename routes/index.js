var Endpoint = require('express-endpoint')
  , customRules = require('../rules')
  , Indexer = require('../lib/indexer')
  , bb = require('batbelt')
  , indexer = new Indexer(null, bb.NOOP)
  , BatchJobs = require('../lib/batchjobs')
  , customRules = require('../rules')
  , batchJobs = new BatchJobs();

var search = new Endpoint({
  path: '/1/search',
  description: 'Search users by skill',
  example: '/1/search?skill=java',
  parameters: [
    {
      name: 'skill',
      rules: ['required'],
      description: 'Skills to search for.'
    }
 ],
 handler: function(req, res) {
   indexer.search(req.endpointParams.skill.join(' '), function(err, response) {
     if (err) {
       throw new Error('Elastic search phailed hard');
     } else {
       res.renderEndpointData(response);
     }
   });
 }
});

var meetupCrawl = new Endpoint({
  path: '/1/meetup/crawl',
  description: 'Crawn meetup.com with a seed meetup group URL',
  example: '/1/meetup/crawl?url=http://meetup.bostonpython.com/&apiKey=shhhh',
  parameters: [
    {
      name: 'apiKey',
      rules: ['required', 'apiKey', 'once'],
      description: 'Admin api key'
    },
    {
      name: 'url',
      rules: ['required', 'url', 'once'],
      description: 'Meetup to seed for crawl.'
    }
 ],
 rules: customRules,
 handler: function(req, res) {
   batchJobs.crawlMeetup(req.endpointParmas.url.href, function(err, response) {
     if (err) {
       throw err;
     } else {
       res.renderEndpointData(response);
     }
   });
 }
});

exports.search = search
exports.endpoints = [search, meetupCrawl]

exports.index = function(req, res) {
  res.render('index', { title: 'Heystack' })
}

exports.docs = Endpoint.catalog({endpoints: exports.endpoints})
