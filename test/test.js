var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = require("assert");
var http = require('http');

var should = chai.should();

var sniffer = require('../index.js');

chai.use(chaiAsPromised);

describe('Sniff', function () {
	var server;

	before(function() {
		server = http.createServer(function (request, response) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.end('<http><head>' +
				'<style>' +
				'   body {' +
				'       background-color: #000000;' +
				'       font-family: Arial;' +
				'   }' +
				'   h1 {font-family: Georgia;}' +
				'</style>' +
				'</head><body><h1>Hello World!</h1></body></http>');
		});

		server.listen(5050);
	});

	after(function () {
		server.close();
	});

	it('responds with matching font collection', function () {
		return sniffer('http://localhost:5050', 'h1', 'font-family').should.eventually.equal('Georgia');
	});

	it('should be rejected', function () {
		return sniffer('http://localhost:5050', 'h2', 'font-family').should.be.rejected;
	});
});