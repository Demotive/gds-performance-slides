// switchable urls for json data
if (offline === false) {
	var narrativeUrl = '/visitors-narrative/content'; // see server.rb
} else {
	var narrativeUrl = 'assets/data/visitors-narrative.html';
}

var el = $('.intro-strap');

// grab narrative and insert into div
var getNarrative = function() {
	// using the html version?
	el.load( narrativeUrl + " #narrative" );
	/*$.ajax({
		dataType: 'json',
		crossDomain: true,
		cache: false,
		url: narrativeUrl,
		success: function(d) {
			// update the display
			el.html(d.details.data.content);
		}
	});*/
};

// initial load
getNarrative();

if (offline === false) {
	// poll narrative once a day(...is this nuts?!?)
	setTimeout(function() {
		getNarrative();
	}, 24*60*60*60);
}
