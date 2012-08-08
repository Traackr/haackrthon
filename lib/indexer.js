var bb = require('batbelt');
var ElasticSearchClient = require('elasticsearchclient');

function Indexer(opts, fn) {

	this.config = bb.merge({
		"esServerHosts": [
		    {host: "haackr-es1.traackr.com", port: 9300},
		    {host: "haackr-es2.traackr.com", port: 9300}],
		"esServerIndex": "heystack",
		"esDocType": "user"
	}, opts);
	
	var serverOptions = { hosts: this.config.esServerHosts };
	
	this.esClient = new ElasticSearchClient(serverOptions);
	
	console.log('indexer created');
	fn(null, this);
}

Indexer.prototype.populater = function(fn) {
	
	this.esClient.index(
		this.config.esServerIndex, 
		this.config.esDocType, 
		{"id":"1111", "name":"Bob Corsaro", "interests":"linux node.js", "groups":"Boston Javascript"}
    ).on('error', function() {
        console.error('FML')
	}).on('data', function(data) {
		console.log(data)
		fn(null, data);
	}).exec();

	console.log('indexing started');
}

exports = module.exports = Indexer
