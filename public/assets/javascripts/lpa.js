// switchable urls for json data
if (offline === false) {
	var lpaUrl = '/realtime/lpa'; // see server.rb
} else {
	var lpaUrl = 'assets/data/lpa.json';
}

var totalEl = $('#total');
var digitalEl = $('#digital');
var nDigitalEl = $('#nDigital');
var dateEl = $('#date');

// grab json from gov.uk
var updateDisplay = function() {
	$.ajax({
		dataType: 'json',
		crossDomain: true,
		cache: false,
		url: lpaUrl,
		success: function(d) {
			// roll through the data and add up all the numbers to get the totals (digital and paper)
			var i, _i;
			var dTotal = 0;
			var nTotal = 0;
			var total = 0;
			var digital = [];
			var nDigital = [];
			var dateFrom;
			for (i=0, _i=d.data.length; i<_i; i++) {
				switch (d.data[i].key) {
					case "property_and_financial_digital_applications":
					case "health_and_welfare_digital_applications":
						dTotal = dTotal + d.data[i].value;
						digital.push(d.data[i]);
						break;
					case "property_and_financial_paper_applications":
					case "health_and_welfare_paper_applications":
						nTotal = nTotal + d.data[i].value;
						//nDigital.push(d.data[i]);
						break;
				}
			}
			total = dTotal + nTotal;
			dateFrom = digital[0]._week_start_at.split('-');
			
			totalEl.text(addCommas(total));
			digitalEl.text(addCommas(dTotal));
			nDigitalEl.text(addCommas(nTotal));
			dateEl.text(dateFrom[2].split('T')[0] + ' ' + monthsMap[dateFrom[1]] + ' ' + dateFrom[0]);
		}
	});
};

// initial loads for user count and satisfaction level
updateDisplay();

if (offline === false) {
	// poll once a day(...is this nuts?!?)
	setTimeout(function() {
		updateDisplay();
	}, 24*60*60*60);
}
