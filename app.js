var http = require('http')
	, util = require('util');

var optionsFrom = {
	host: 'deathstar',
	port: 8001,
	path: '/log',
	method: 'GET',
};

function map(items, func) {
	var todo = items.concat();

	function handle() {
		func(todo.shift());
		if(todo.length > 0) {
			process.nextTick(handle);
		}
	}

	handle();
}


var req = http.request(optionsFrom, function(res) {
	var data = '';
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		data += chunk;
	});

	res.on('end', function() {
		var entries = data.split('\n\n');
		map(entries, function(entry) {
			var lines = entry.split('\n');
			if (lines.length == 3) {
				var splitDate = lines[0].split(' ');
				var stringDate = splitDate[2] + ' ' + splitDate[1] + ' ' + splitDate[5] + ' ' + splitDate[3];

				var date = new Date();
				date.setTime(Date.parse(stringDate));

				var package = {};
				package["date"] = date;

				var splitTemp1 = lines[1].split(' ');
				var temp1 = splitTemp1[8];
				package["processor"] = temp1;

				var splitTemp2 = lines[2].split(' ');
				var temp2 = splitTemp2[8];
				package["inside"] = temp2;

				console.log(util.inspect(package));
			};
		});

	});
})

req.on('error', function(e) {
	console.log('Problem with request: ' + e.message);
});

req.end();

