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

  if (fn) {
    fn(null, this);
  }
}

Indexer.prototype.index = function(userDoc, fn) {

  if (!userDoc) {
    throw new Error('FU Bryan'); }

	this.esClient.index(
		this.config.esServerIndex,
		this.config.esDocType,
    userDoc)
  .on('error', function(err) {
    console.error('Failed to index '+inspect(userDoc));
    fn(err); })
  .on('userDoc', function(userDoc) {
		fn(null, userDoc); })
  .exec();
}

Indexer.prototype.findAllUserIds = function(fn) {
  this.esClient.search(
		this.config.esServerIndex,
		this.config.esDocType,
    {
      query: {
        wildcard: {
          "name": "*"
        }
      }
    })
  .on('error', fn)
  .on('data', function(data) {
        var response = JSON.parse(data);
  		var ids = response.hits.hits.map(function(user) {
  			return user._id;
  		});
  		fn(null, ids);
   })
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

    if (!response.hits) {
      fn(null, []);
    } else {
      var users = response.hits.hits.map(function(user) {
        var userprops = user._source;
        userprops.id = user._id;
        userprops.url = 'http://www.meetup.com/members/'+user._id+'/';
        return userprops;
      });
      fn(null, users);
    } })
  .exec();
}

Indexer.prototype.delete = function(docid, fn) {
  this.esClient.deleteDocument(
		this.config.esServerIndex,
		this.config.esDocType,
    docid)
  .on('error', fn)
  .on('data', function(data) {
    fn() })
  .exec();
}


exports = module.exports = Indexer
