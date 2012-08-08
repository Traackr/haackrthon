var Endpoint = require('express-endpoint')
  , customRules = require('../rules')
  , indexer = require('../lib/indexer');

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

   });
 }
});

exports.endpoints = [myapi]

exports.index = function(req, res) {
  res.render('index', { title: 'Heystack' })
}

exports.docs = Endpoint.catalog({endpoints: exports.endpoints})
