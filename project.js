var fs = require('fs'),
	updateService = require('./updateService'),
	cloner = require('./cloner'),
	path = require('path'),
	git = require('./git');

var Project = function(path, gitUrl){
	this.path = path;
	this.gitUrl = gitUrl;
};

Project.prototype.sync = function (cb) {
	if (!fs.existsSync(path.join(this.path, '.git'))) {
		cloner.clone(this, cb);
	} else {
		updateService.update(git.open(this.path), cb);
	}
};

module.exports = Project;
