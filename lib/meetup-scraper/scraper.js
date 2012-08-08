var request = require('request')
  , jsdom = require('jsdom')
  , member = require('./member');

Scraper = function () {
}

Scraper.prototype.request = function(url, page, fn) {
	var pageUrl = url + "?offset=" + (page * 20);
	console.log("request: "+pageUrl);
	request({uri: pageUrl}, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
			fn(body);
	  }
		else
			fn(error);
	});
};

Scraper.prototype.membersPage = function(html_body, fn) {
	jsdom.env({
	    html: html_body,
	    scripts: [
	      'http://code.jquery.com/jquery-1.7.2.min.js'
	    ]
	  }, function (err, window) {
	    var $ = window.jQuery;
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
	    fn(members);
	  });
};

Scraper.prototype.members = function(url, offset, allMembers, fn) {
	this.request(url, offset, function(body){
		var scraper = new Scraper();
		scraper.membersPage(body, function(members){
			console.log("found "+members.length+" members");
			allMembers = allMembers.concat(members);
			if(members.length==20) {
				var scraper = new Scraper();
				scraper.members(url, offset+1, allMembers, fn);
			}
			else
				fn(allMembers);
		});
	});
};	

Scraper.prototype.memberDetails = function(html, fn) {
};