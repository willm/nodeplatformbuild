var git = require('./git'),
	mkdirp = require('mkdirp');

exports.clone = function(project){
	mkdirp.sync(project.path);
	git.clone(project.gitUrl);
}
