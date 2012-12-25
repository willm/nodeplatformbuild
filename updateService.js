var fs = require('fs'),
	git = require('./git'),
	path = require('path');

exports.update = function(project){
	var startDirectory = process.cwd();
	process.chdir(path.join(startDirectory, project.path));

	git.branch(function(branch){
		git.status(function(changes){
			if(changes){
				git.stash.save(function(){
					git.pull(branch, function(){
						git.stash.pop();
					});
				});
			}
			else{
				git.pull(branch);
			}
		});

		process.chdir(startDirectory);
	});
}
