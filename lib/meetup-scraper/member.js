Member = function (id, name) {
	this.id=id;
	this.name=name;
}

/**
 * Member prototype.
 */

Member.prototype = {
	setName: function(name){
    this.name = name;
  },
	setUrl: function(url){
    this.url = url;
  },
	setAvatar: function(avatar){
    this.avatar = avatar;
  },
	setInterests: function(interests){
	  this.interests = interests;
	},
	setGroups: function(groups){
	  this.groups = groups;
	}
}