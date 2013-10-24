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
	//el.load( narrativeUrl + " #narrative" );
	$.ajax({
		dataType: 'html',
		crossDomain: true,
		cache: false,
		url: narrativeUrl,
		success: function(d) {
			var $d = $(d);
			var str = $d.find('#narrative').html();
			// split on the bloody comma
			var split = str.split(', ');
			var newStr = split[0] + ',<br>' + split[1];
			el.html(newStr);
		}
	});
};

// initial load
getNarrative();

if (offline === false) {
	// poll narrative once a day(...is this nuts?!?)
	setTimeout(function() {
		getNarrative();
	}, 24*60*60*60);
}
