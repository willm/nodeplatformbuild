var fs = require('fs'),
	os = require('os'),
	path = require('path'),
	Project = require('./project');

var rulesDir = path.join(__dirname,'_rules');

var getProjects = function(){
	var projects = [];
	var projectPath, url;
	var lines = readAllLines(path.join(rulesDir,'Modules.rule'));

	lines.forEach(function(line){
		if(line !== ''){
			projectPath = line.substring(0,line.lastIndexOf('=')).trim();
			url = line.substring(line.lastIndexOf('=') + 1).trim();
			projects.push(new Project(projectPath, url));
		}
	});
	return projects;
}

var readAllLines = function(filePath){
	return fs.readFileSync(filePath,'utf8').split(os.EOL);
}

exports.getAll = function(){
	return getProjects();
}
