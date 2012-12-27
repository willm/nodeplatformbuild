var fs = require('fs'),
	updateService = require('./updateService'),
	cloner = require('./cloner'),
	path = require('path');

exports.syncProject = function(project, cb){
	if(!fs.existsSync(path.join(project.path, '.git'))){
		cloner.clone(project,cb);
	}
	else{
		updateService.update(project,cb);	
	}
}
