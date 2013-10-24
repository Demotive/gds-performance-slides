// switch this to true to use data in the /assets/data folder
var offline = false;

// very cheap and cheerful
var monthsMap = {
	"01" : "January",
	"02" : "February",
	"03" : "March",
	"04" : "April",
	"05" : "May",
	"06" : "June",
	"07" : "July",
	"08" : "August",
	"09" : "September",
	"10" : "October",
	"11" : "November",
	"12" : "December"
};

var addCommas = function(n) {
	n += '';
	x = n.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}