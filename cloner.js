var git = require('./git'),
	fs = require('fs-extra');

exports.clone = function (project, cb) {
	fs.mkdirp(project.path, function () {
		git.clone(project.gitUrl, project.path, function () {
			if (cb) {
				cb();
			}
		});
	});
};
