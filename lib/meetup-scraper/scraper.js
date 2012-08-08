var request = require('request')
  , jsdom = require('jsdom')
  , member = require('./member');

Scraper = function () {
}

Scraper.prototype.findMembers = function(url, fn) {
	function handler(error, body) {
	    if (error) {
	    	fn(error);
	    } else {
	    	members(body, fn);
	    }
	}
	request(url, handler);
};

Scraper.prototype.request = function(url, fn) {
	request({uri: url}, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
			fn(null, body);
	  }
		else
			fn(error);
	});
};

Scraper.prototype.members = function(html_body, fn) {
	jsdom.env({
	    html: html_body,
	    scripts: [
	      'http://code.jquery.com/jquery-1.7.2.min.js'
	    ]
	  }, function (err, window) {
	    var $ = window.jQuery;
	    // jQuery is now loaded on the jsdom window created from 'agent.body'
			var memberCountHtml = $('.D_count').html();
			var memberCount = memberCountHtml.substring(1,memberCountHtml.length-1);
			var members = new Array();
			var membersHtml = $('.memName');
			for(var i=0; i<membersHtml.length; i++) {
				var memberHtml = membersHtml[i];
				var memberGroupUrl = memberHtml._attributes.href._nodeValue;
				var memberId = memberGroupUrl.substring(memberGroupUrl.indexOf("members")+8,memberGroupUrl.length-1)
 				var memberName = memberHtml._childNodes['0'].__nodeValue;
				var member = new Member(memberId,memberName);
				member.setUrl("http://www.meetup.com/members/"+memberId+"/");
				members.push(member);
			}
	    fn(null, members);
	  });
};

Scraper.prototype.member = function(html, fn) {
};