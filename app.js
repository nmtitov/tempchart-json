var http = require('http')
	, util = require('util');

var port = process.env['NODE_PORT']||8080;

var optionsFrom = {
	host: 'deathstar',
	port: 8001,
	path: '/log',
	method: 'GET',
};

http.createServer(function (ureq, ures) {
	var req = http.request(optionsFrom, function(res) {
		var data = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			data += chunk;
		});

		res.on('end', function() {
			var entries = data.split('\n\n');
			var response = [];

			for (var i = entries.length - 1; i >= 0; i--) {
				var entry = entries[i];
				var lines = entry.split('\n');
				if (lines.length == 3) {
					var splitDate = lines[0].split(' ');
					var stringDate = splitDate[2] + ' ' + splitDate[1] + ' ' + splitDate[5] + ' ' + splitDate[3];

					var date = new Date();
					date.setTime(Date.parse(stringDate));

					var package = [];
					package.push(date);

					var splitTemp1 = lines[1].split(' ');
					var temp1 = parseInt(splitTemp1[8]);
					package.push(temp1);

					var splitTemp2 = lines[2].split(' ');
					var temp2 = parseInt(splitTemp2[8]);
					package.push(temp2);

					response.push(package);
				};
			};

			ures.writeHead(200, {'Content-Type': 'text/plain'});
			ures.end("_testcb('" + JSON.stringify(response) + "')");

		});
	})

	req.on('error', function(e) {
		console.log('Problem with request: ' + e.message);
	});

	req.end();
}).listen(port);

console.log('Started server');
