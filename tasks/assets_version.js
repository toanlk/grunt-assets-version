/*
 * grunt-assets-version
 * https://github.com/toanlk/grunt-assets-version
 *
 * Copyright (c) 2020 Le Khanh Toan
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
	path = require('path'),
	crypto = require('crypto');

module.exports = function (grunt) {

	function md5(filepath, algorithm, encoding, fileEncoding) {
		var hash = crypto.createHash(algorithm);
		grunt.log.verbose.write('Hashing ' + filepath + '...');
		hash.update(grunt.file.read(filepath), fileEncoding);
		return hash.digest(encoding);
	}

	grunt.registerMultiTask('assets_version', 'Static file asset revisioning through content hashing', function () {
		var options = this.options({
			encoding: 'utf8',
			algorithm: 'md5',
			length: 10
		});

		this.files.forEach(function (filePair) {
			filePair.src.forEach(function (f) {

				var hash = md5(f, options.algorithm, 'hex', options.encoding),
					prefix = hash.slice(0, options.length),
					renamed = [path.basename(f), prefix].join('.'),
					outPath = path.resolve(path.dirname(f), renamed);

				grunt.verbose.ok().ok(hash);
				fs.renameSync(f, outPath);
				grunt.log.write(f + ' ').ok(renamed);

			});
		});
	});

};
