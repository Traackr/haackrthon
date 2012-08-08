var bb = require('batbelt');
var ElasticSearchClient = require('elasticsearchclient');

function Indexer(opts, fn) {

	this.config = bb.merge({
		"esServerHosts": [
		    {host: "haackr-es1.traackr.com", port: 9200},
		    {host: "haackr-es2.traackr.com", port: 9200}],
		"esServerIndex": "heystack",
		"esDocType": "user"
	}, opts);

	var serverOptions = { hosts: this.config.esServerHosts };

	this.esClient = new ElasticSearchClient(serverOptions);

	fn(null, this);
}

Indexer.prototype.index = function(data, fn) {

	this.esClient.index(
		this.config.esServerIndex,
		this.config.esDocType,
    data)
  .on('error', fn)
  .on('data', function(data) {
		fn(null, data); })
  .exec();
}

Indexer.prototype.search = function(term, fn) {
  this.esClient.search(
		this.config.esServerIndex,
		this.config.esDocType,
    {
      query: {
        query_string: {
          analyzer: "custom_text",
          fields: [
            'groups.group_name',
            'interests'
          ],
          query: term,
          default_operator: 'and'
        }
      }
    })
  .on('error', fn)
  .on('data', function(data) {
    var response = JSON.parse(data);
    var users = response.hits.hits.map(function(user) {
      var userprops = user._source;
      userprops.id = user._id;
      userprops.url = 'http://www.meetup.com/members/'+user._id+'/';
      return userprops;
    });
    fn(null, users); })
  .exec();
}


exports = module.exports = Indexer
