var exec = require('child_process').exec,
	child_process = require('child_process'),
	color = require('cli-color'),
	git = require('./git.js'),
	path = require('path'),
	fs = require('fs'),
	mkdirp = require('mkdirp');

var updateDirectory = function(directory){
	var dependencyPath = 'lib';
	//change dependencyPath to read from the dependency rules file
	console.log('in: ' + process.cwd() + 'cding to: ' + directory);
	process.chdir(directory);
	console.log('IN DIR : ' + process.cwd());
	git.branch(function(branchOutput){
		var branch = branchOutput.substring(2);
		console.log(color.cyan("Updating " + directory + " to latest " + branch));

		if(fs.existsSync(dependencyPath))
			git.checkout(dependencyPath);

		git.status(function(stout){
			var changes = stout === '';
			if(changes){
				console.log(color.blue('Changes will be stashed and re-applied'));
				git.stash.push("automatic stash", function(){
					console.log('pulling '+ directory);
					git.pull(branch, function(){			
						git.stash.pop();
					});
				});
			}
			else{
				console.log(color.blue('No local changes'));
				console.log('pulling '+ directory + ' branch '+branch);
				git.pull(branch);
			}
		});
	});
}


var cleanBuildDirectory= function(directory){
	console.log('in ' + process.cwd());
	console.log('going to ' + path.join(directory,'build'));
	if(!fs.existsSync('build')) return;
	process.chdir('build');
	git.status(function(stdout){
		var changes = stdout.split('\n');
		changes.forEach(function(change){
			if(change.indexOf(' M ')===0 && change !== ' M Build.cmd')
				git.checkout(change.substr(3));
		});
	});
}

var updateAll = function(){
	var repositories = getDirectories();
	var baseDir = process.cwd();
	console.log("Running all updates -- please wait");
	console.log('this many repos: ' +repositories.length);
	repositories.forEach(function(repo){
		if(!fs.existsSync(path.join(repo.path,'.git'))){ 
			console.log('making dir' + repo.path);
			mkdirp.sync(repo.path);
			git.clone(repo.url,repo.path,function(){
				updateDirectory(repo.path);
				cleanBuildDirectory(repo.path);
				process.chdir(baseDir);
			});
		}
		else {
			console.log('path exists :' + repo.path);
			console.log(repo.path);
			updateDirectory(repo.path);
			cleanBuildDirectory(repo.path);
			process.chdir(baseDir);
		}	
	});
}

fs.readAllLines = function(path){
	var lines = fs.readFileSync(path,'utf8').split('\r\n');
	return lines;
}

var getDirectories = function(){
	var modules = [];
	fs.readAllLines('_rules/Modules.rule').forEach(function(line){
		if(line !== ''){
			modules.push({
				path :line.substring(0,line.lastIndexOf('=')).trim(),
				url :line.substring(line.lastIndexOf('=') + 1).trim()
			});
		}
	});
	return modules;
}

updateAll();
