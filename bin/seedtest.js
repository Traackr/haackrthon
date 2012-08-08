var Indexer = require('../lib/indexer');

function start(err, indexer) {
  if (err) {
    console.error(err.stack)
    throw new Error("Failed to create ES Client")
  }
  
  var data = {
        	 id: "12980712",
        	 name: "Rich Rosenbaum",
        	 interests: ["Big Data", "Machine Learning", "HTML5, Data Analytics", "Cloud Computing", "Apache Lucene and Solr Open Source Search", "Data Visualization", "Predictive Analytics", "Web Analytics", "Social Media Marketing"],
        	 thumbnail_url: "http://photos1.meetupstatic.com/photos/member/a/7/e/0/member_10782976.jpeg",
        	 groups: [{"group_id": "The-Boston-Amazon-Web-Services-Meetup-Group", "group_name": "Boston People interested in Amazon Web services"}, {"group_id": "bostonhadoop", "group_name": "Boston Hadoop User Group"}]
      };
      
  indexer.index(data, function(err, data) {
    if (err) {
        console.error(err.stack)
    	throw new Error("Failed to index data to ES Client")
  	}
  });
}

new Indexer(null, start)