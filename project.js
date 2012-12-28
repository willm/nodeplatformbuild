var fs = require('fs'),
	updateService = require('./updateService'),
	cloner = require('./cloner'),
	path = require('path'),
	git = require('./git');

exports.syncProject = function (project, cb) {
	if (!fs.existsSync(path.join(project.path, '.git'))) {
		cloner.clone(project, cb);
	} else {
		updateService.update(git.open(project.path), cb);
	}
};
