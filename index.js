var path = require('path');
var phantom = require('phantom');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function (options) {
	options = _.defaults(options || {url: '', selector: 'body', style: 'background-color'});

	if(options.url === '') {
		return Promise.reject(new Error('Url is missing'));
	}

	var phantomOptions = {
		path: path.join(__dirname, 'node_modules/phantomjs/lib/phantom/bin/'),
		onStdout: function (data) {
			// do nothing
		}
	};

	return new Promise(function (resolve, reject) {

		phantom.create('--ignore-ssl-errors=true', '--web-security=false', function (ph) {
			ph.createPage(function (page) {
				page.open(options.url, function (status) {

					page.evaluate(function (sel, st) {
						var el = document.querySelector(sel);
						return window.getComputedStyle(el, null).getPropertyValue(st);

					}, function (result) {

						if(result) {
							resolve(result);
						} else {
							reject('Nothing found');
						}

					}, options.selector, options.style);

					ph.exit();
				});
			});
		}, phantomOptions);

	});
};