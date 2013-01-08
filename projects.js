var fs = require('fs'),
	os = require('os'),
	Project = require('./project');

var getProjects = function(){
	var projects = [];
	var path, url;
	readAllLines('_rules/Modules.rule').forEach(function(line){
		if(line !== ''){
			path = line.substring(0,line.lastIndexOf('=')).trim();
			url = line.substring(line.lastIndexOf('=') + 1).trim();
			projects.push(new Project(par, url));
		}
	});
	return projects;
}

var readAllLines = function(path){
	return fs.readFileSync(path,'utf8').split(os.EOL);
}

exports.getAll = function(){
	return getProjects
}
