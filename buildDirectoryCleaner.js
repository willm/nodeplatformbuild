var path = require('path'),
	fs = require('fs');

exports.clean = function (repo) {
	var buildDirectory = 'build';
	if(!fs.existsSync(path.join(repo.repoPath,buildDirectory))){
		return;
	}	
	repo.status(function(changes){
		changes.forEach(function(change){
			if(change.indexOf(' M build/') === 0 && change.indexOf('build/Build.cmd') === -1){
				repo.checkout(change.substring(3));
			}
		});
	});
};
