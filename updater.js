var fs = require('fs'),
	updateService = require('./updateService'),
	cloner = require('./cloner'),
	path = require('path');

exports.update = function(project, cb){
	process.cwd();
	if(!fs.existsSync(path.join(project.path, '.git'))){
		cloner.clone(project,cb);
	}
	else{
		updateService.update(project,cb);	
	}
}
