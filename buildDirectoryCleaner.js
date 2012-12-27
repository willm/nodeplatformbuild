var fs = require('fs')
	git = require('./git');

exports.clean = function () {
	var buildDirectory = 'build';
	if(!fs.existsSync(buildDirectory)){
		return;
	}	
	process.chdir('build');
	git.status(function(changes){
		changes.forEach(function(change){
			if(change.indexOf(' M build/') === 0 && change.indexOf('build/Build.cmd') === -1){
				git.checkout(change.substring(3));
			}
		});
	});
};
