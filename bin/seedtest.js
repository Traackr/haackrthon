var Indexer = require('../lib/indexer');

function start(err, indexer) {
  if (err) {
    console.error(err.stack)
    throw new Error("Failed to create ES Client")
  }
  
  indexer.populater(function(err, data) {
    if (err) {
        console.error(err.stack)
    	throw new Error("Failed to index data to ES Client")
  	}
  })
}

new Indexer(null, start)