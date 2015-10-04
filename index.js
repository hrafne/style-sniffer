var path = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var phridge = require('phridge');

module.exports = function (options) {
	options = _.defaults(options || {url: '', selector: 'body', style: 'background-color'});

	if(options.url === '') {
		return Promise.reject(new Error('Url is missing'));
	}

	return new Promise(function (resolve, reject) {
		phridge.spawn({
			loadImages: false,
			'--ignore-ssl-errors': true,
			'--web-security': false
		})
			.then(function (ph) {
				return ph.openPage(options.url);
			})
			.then(function (page) {
				console.log('run');
				return page.run(options.selector, options.style, function (selector, style) {
					return this.evaluate(function (sel, st) {
						var el = document.querySelector(sel);
						return window.getComputedStyle(el, null).getPropertyValue(st);
					}, selector, style)
				})
			})
			.finally(phridge.disposeAll)
			.done(function (text) {
				if(text) {
					resolve(text);
				} else {
					reject('Nothing found');
				}
			}, function (err) {
				reject(err);
			});
	});
};