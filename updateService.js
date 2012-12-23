var fs = require('fs'),
	git = require('./git');

exports.update = function(project){
	process.chdir(project.path);
	git.status(function(changes){
		if(changes){
			git.stash.save();
		}
	});
}
