var fs = require('fs'),
	updateService = require('./updateService'),
	cloner = require('./cloner'),
	path = require('path'),
	git = require('./git');

exports.syncProject = function (project, cb) {
	if (!fs.existsSync(path.join(project.path, '.git'))) {
		cloner.clone(project, cb);
	} else {
		updateService.update(project, cb);
	}
};

exports.cleanBuildDirectory = function () {
	var buildDirectory = 'build';
	if(!fs.existsSync(buildDirectory)){
		return;
	}	
	process.chdir('build');
	git.status(function(changes){
		changes.forEach(function(change){
			if(change.indexOf(' M ') === 0 && change.indexOf('Build.cmd') === -1 && change.indexOf(' M ../') !== 0){
				git.checkout(change.substring(3));
			}
		});
	});
};
