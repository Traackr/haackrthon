var bb = require('batbelt');

function Indexer(opts, fn) {

	this.config = bb.merge({
			"esServerHosts": ["haackr-es1.traackr.com", "haackr-es2.traackr.com"],
			"esServerPort": 9300,
			"esServerIndex": "heystack",
			"esDocType": "user"
			}, opts);
	
	var serverOptions = {
   	 	hosts:[
        	{
            	host: this.config.esServerHosts[0],
            	port: port: this.config.esServerPort
        	},
        	{
            	host: this.config.esServerHosts[1],
            	port: this.config.esServerPort
        	}
        ]
	};
	
	this.esClient = new ElasticSearchClient(serverOptions);
	
	fn(null, this)
}

Indexer.prototype.populater = function(fn) {
	
	this.esClient.index(
			this.config.esServerIndex, 
			this.config.esDocType, 
			{id:"1111", "name":"Bob Corsaro", "interests":"linux node.js", "groups":"Boston Javascript"}
		)
        .on('data', function(data) {
        	console.log(data)
        	fn(null, data);
        })
        .exec()
}

exports = module.exports = Indexer