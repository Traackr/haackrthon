var Endpoint = require('express-endpoint')
  , customRules = require('../rules.js')

var myapi = new Endpoint({
  path: '/1/echo',
  description: 'Echo input back to caller',
  example: '/1/echo?apiKey=secretkey&message=hello+world',
  parameters: [
    {
      name: 'apiKey',
      rules: ['required', 'once', 'apiKey'],
      description: 'Your api key.'
    },
    {
      name: 'message',
      rules: ['required', 'once'],
      description: 'Message to echo back'
    }
 ],
 rules: customRules,
 handler: function(req, res) {
   res.renderEndpointData(req.endpointParams);
 }
});

exports.endpoints = [myapi]

exports.index = function(req, res) {
  res.render('index', { title: 'Express' })
}

exports.docs = Endpoint.catalog({endpoints: exports.endpoints})
