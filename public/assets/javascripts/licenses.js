// switchable urls for json data
if (offline === false) {
	var licencesUrl = '/realtime/licenses'; // see server.rb
} else {
	var licencesUrl = 'assets/data/licenses.json';
}

var el = $('#license-output tbody');

// grab json from gov.uk
var updateDisplay = function() {
	$.ajax({
		dataType: 'json',
		crossDomain: true,
		cache: false,
		url: licencesUrl,
		success: function(d) {
			var i, _i;
			var str = "";
			for (i=0, _i=d.data.length; i<_i; i++) {
				str += "<tr><td>" + d.data[i]._count + "</td>";
				str += "<td>" + d.data[i].licenceName[0] + "</td></tr>";
			}
			el.append(str);
		}
	});
};

// initial loads for user count and satisfaction level
updateDisplay();

if (offline === false) {
	// poll user satisfaction once a day(...is this nuts?!?)
	setTimeout(function() {
		updateDisplay();
	}, 24*60*60*60);
}
