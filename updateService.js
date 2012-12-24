var fs = require('fs'),
	git = require('./git');

exports.update = function(project){
	process.chdir(project.path);
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
	});
}
