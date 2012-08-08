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
  }
}