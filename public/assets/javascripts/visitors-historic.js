// switchable urls for json data
if (offline === false) {
	var historicUrl = '/visitors-historic/content'; // see server.rb
} else {
	var historicUrl = 'assets/data/visitors-historic.json';
}

// grab json from gov.uk
var updateDisplay = function() {
	$.ajax({
		dataType: 'json',
		crossDomain: true,
		cache: false,
		url: historicUrl,
		success: function(d) {
			// get the right subset
			d = d.details.data;
			var i, _i;
			var govuk = [];
			// We're only dealing with GOV.UK results!
			for (i=0, _i=d.length; i<_i; i++) {
				if (typeof d[i].value['govuk'] !== 'undefined') {
					govuk.push(d[i]);
				}
			}
			// get the LAST (most recent) item:
			var latestData = govuk[govuk.length-1];
			
			// get the year + month + day (day as Number)
			var split = latestData.end_at.split('-');
			var year = split[0];
			var month = split[1];
			var day = parseInt(split[2]);
			
			// now get comparable data from 1 YEAR AGO (the same month) in a smaller array
			var historicMonthData = [];
			for (i=0, _i=govuk.length; i<_i; i++) {
				var s = govuk[i].end_at.split('-');
				if (s[0] !== year && s[1] === month) {
					historicMonthData.push(govuk[i]);
				}
			}
			
			// chug through dates (backwards) to get the "nearest-ish" from a year ago
			// what do we want?
			// 1. An EQUAL end date for the previous year
			// 2. Failing that, the NEAREST end date
			var compare = [];
			var compareCount = 0;
			for (i=historicMonthData.length-1, _i=0; i>=_i; i--) {

				var s = historicMonthData[i].end_at.split('-');
				s = parseInt(s[2]);
				if (s === day) {
					console.log(s + ': same day!');
					historicValue = historicMonthData[i].value['govuk'];
					compare.length = 0;	// flush the compare array, we have a match!
					compare[compareCount] = [s ,historicMonthData[i]];
					compareCount++;
					break;
				} else if (s > day) {
					console.log(s + ": currently later than the day");
					compare[compareCount] = [s ,historicMonthData[i]];
					compareCount++;
				} else {
					console.log(s + ": now earlier than the day");
					compare[compareCount] = [s ,historicMonthData[i]];
					compareCount++;
					break;
				}
			}

			var historicData;
			if (compare.length > 1) {
				// Do a comparison of s - find the smallest remainder
				var r1 = Math.abs(day - compare[0][0]);
				var r2 = Math.abs(day - compare[1][0]);
				if (r1 < r2) {
					historicData = compare[0][1];
				} else {
					historicData = compare[1][1];
				}
			} else {
				historicData = compare[0][1];
			}
			
			var latestEl = $('#latest');
			var historicEl = $('#historic');
			var latestSmallPrint = $('#latestDates');
			var historicSmallPrint = $('#historicDates');
			
			// update the display (pretty):
			latestEl.text(addCommas(latestData.value['govuk']));
			historicEl.text(addCommas(historicData.value['govuk']));
			
			// DD MMM - DD MMM
			var startSplit = latestData.start_at.split('-');
			var latestStr = '';
			latestStr += parseInt(startSplit[2]) + ' ';
			latestStr += monthsMap[startSplit[1]] + ' - ';
			latestStr += day + ' ';
			latestStr += monthsMap[month] + ' ';
			latestStr += year;
			
			latestSmallPrint.text(latestStr);
			
			// now do historic dates
			var hStartSplit = historicData.start_at.split('-');
			var hEndSplit = historicData.end_at.split('-');
			
			var hLatestStr = '';
			hLatestStr += parseInt(hStartSplit[2]) + ' ';
			hLatestStr += monthsMap[hStartSplit[1]] + ' - ';
			hLatestStr += parseInt(hEndSplit[2]) + ' ';
			hLatestStr += monthsMap[hEndSplit[1]] + ' ';
			hLatestStr += hEndSplit[0];
			
			historicSmallPrint.text(hLatestStr);
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
