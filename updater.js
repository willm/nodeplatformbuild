var fs = require('fs'),
	updateService = require('./updateService'),
	cloner = require('./cloner'),
	path = require('path');

exports.update = function(project){
	process.cwd();
	if(!fs.existsSync(path.join(project.path, '.git'))){
		cloner.clone(project);
	}
	else{
		updateService.update(project);	
	}
}
