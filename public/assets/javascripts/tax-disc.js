// switchable urls for json data
if (offline === false) {
	var usersUrl = '/realtime/tax-disc'; // see server.rb
	var satisfactionUrl = '/satisfaction/tax-disc'; // see server.rb
} else {
	var usersUrl = 'assets/data/tax-disc-realtime-users.json';
	var satisfactionUrl = 'assets/data/tax-disc-customer-satisfaction.json';
}

var userCountEl = $('#userCount');
var usersCount = [];

var satisfactionEl = $('#satisfactionLevel');
var satisfaction = {
	'satisfied' : 0,
	'unsatisfied' : 0
};

// Returns a random integer between min and max
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// grab live user count json from gov.uk and pop the two returned numbers into an array:
var updateCount = function() {
	// clear the array
	usersCount.length = 0;
	$.ajax({
		dataType: 'json',
		crossDomain: true,
		cache: false,
		url: usersUrl,
		success: function(d) {
			var i, _i;
			for (i=0, _i=d.data.length; i<_i; i++) {
				usersCount.push(d.data[i].unique_visitors)
			}
			// update the display
			wobbleCount();
		}
	});
};

// randonly wobble between the returned numbers to give the illusion of (faster) live activity
var wobbleCount = function() {
	var r = getRandomInt(0, usersCount.length);
	userCountEl.text(usersCount[r]);
};


// create a percentage from the satisfaction number (1-5)
var scoreToPercentage = function(score) {
	var maxScore = 5, minScore = 1;
	var p = ((maxScore - score) / (maxScore - minScore)) * 100;
	return Math.round( p * 10 ) / 10;
};

// grab user satisfaction data, convert to a %
var updateSatisfaction = function() {
	$.ajax({
		dataType: 'json',
		crossDomain: true,
		cache: false,
		url: satisfactionUrl,
		success: function(d) {
			// get the last number (latest):
			var r = scoreToPercentage(d.data[d.data.length-1].satisfaction_tax_disc);
			// satisfaction is a crazy number, need to convert it to a %...
			satisfaction['satisfied'] = r;
			satisfaction['unsatisfied'] = 100 - r;
			fillPie();
		}
	});
};
    
var cv_w = 90,
	cv_h = 90,
	cv_r = Math.min(cv_w, cv_h) / 2;

var cv_arc = d3.svg.arc().outerRadius(cv_r).innerRadius(cv_r - 20);

var cv_pie = d3.layout.pie().value(function (d) { return d.value });

var cv_svg = d3.select("#satisfactionPie")
	.append("svg")
	.attr("width", cv_w)
	.attr("height", cv_h)
	.append("g")
	.attr("transform", "translate(" + cv_r + "," + cv_r + ")");

function cv_arcTween(a) {
	var i = d3.interpolate(this._current, a);
	this._current = i(0);
	return function(t) {
		return cv_arc(i(t));
	};
} 	

function fillPie() {
	//data = satisfaction;
	//var dataa = d3.entries(data);
	//var cv_path = cv_svg.selectAll("path").data(cv_pie(dataa));
	
	var data = d3.entries(satisfaction);
	var cv_path = cv_svg.selectAll("path").data(cv_pie(data));

	cv_path.enter()
		.append("path")
		.attr("fill", function(d, i) {
			return i % 2 ? "none" : "#BFC1C3";
		}) 
		.attr("d", cv_arc)
		.each(function(d) { this._current = d; });

	cv_path.transition().duration(750).attrTween("d", cv_arcTween);

	cv_path.exit().remove();
	
	// update central label
	satisfactionEl.text(satisfaction['satisfied'] + "%");
	
}

// initial loads for user count and satisfaction level
updateCount();
updateSatisfaction();

// wobble numbers within the returned array
var countWobble = window.setInterval(wobbleCount, 30e3);

if (offline === false) {
	// poll gov.uk once every couple of minutes
	var countInterval = window.setInterval(updateCount, 120e3);
	// poll user satisfaction once a day(...is this nuts?!?)
	setTimeout(function() {
		updateSatisfaction();
	}, 24*60*60*60);
}
