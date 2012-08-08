$(document).ready(function() {
	$("#searchBtn").click(function() {
	    var queryStr = $("#skills").val();
		$.ajax({
			type: "POST",
			url: "/1/search",
			data : { skill: queryStr},
			success : function(data) {
			    var markup = '';
			    markup += '<table class="search_results_grid">';
			    for (var i=0; i < data.length; i++) {
			    	var record = data[i];
			    	markup += '<tr>';
			    	
			    	markup += '<td>';
			    		markup += '<a target="_blank" href="' + record.url + '">' + record.name + '</a>';
			    	markup += '</td>';
			    	
			    	markup += '<td>';
			    		markup += '<img class="thumbnail_img" src="' + record.thumbnail_url + '" /> ';	    	
			    	markup += '</td>';
			    	
			    	markup += '<td>';
			    	markup += '<div class="user_groups">';
			    		markup += '<ul>';
			    		for (var j=0; j < record.groups.length; j++) {
			    			markup += '<li><a target="_blank" href="http://meetup.com/' + record.groups[j].group_id + '">' + record.groups[j].group_name + '</a>';
			    		}
			    		markup += '</ul>';
			    	markup += '</div>';
			    	markup += '</td>';
			    	
			    	markup += '</tr>';
			    }
            	markup += '</table>';
            	$("#search_results").html(markup);
            },
            error : function(request, status, error) {
            	alert('Failure executing search: ' + error);
            }
		});
	});
})