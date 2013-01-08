var projects = require('./projects');

exports.sync = function(){	
	projects.getAll().forEach(function(project){
		project.sync();
	});
};
