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
            'groups',
            'interests'
          ],
          query: term,
          default_operator: 'and'
        }
      }
    })
  .on('error', fn)
  .on('data', function(data) {
    fn(null, JSON.parse(data)); })
  .exec();
}


exports = module.exports = Indexer
