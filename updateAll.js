var exec = require('child_process').exec,
	child_process = require('child_process'),
	color = require('cli-color'),
	git = require('./git.js'),
	path = require('path'),
	fs = require('fs'),
	yt = 'yipeeee',
	mkdirp = require('mkdirp');

var updateDirectory = function(directory){
	var dependencyPath = 'lib';
	console.log('in: ' + process.cwd() + 'cding to: ' + directory);
	process.chdir(directory);
	exec('git branch', function(err, stdout, stderr){
		console.log(color.cyan("Updating " + directory + " to latest " + stdout.substring(2)));
	});

	//change dependencyPath to read from the dependency rules file
	if(fs.existsSync(dependencyPath))
		exec('git checkout ' + dependencyPath);

	exec('git status -s', function(err, stout, sterr){
		var changes = stout === '';
		if(changes){
			console.log(color.blue('Changes will be stashed and re-applied'));
			exec('git stash save "automatic stash"');
			pull();
			exec('git stash pop');
		}
		else{
			console.log(color.blue('No local changes'));
			pull();
		}
	});
}

var pull = function(){
	exec('git pull -q --recurse-submodules=yes -Xtheirs origin "$currentBranch"',function(err, stout, sterr){
		console.log(sterr);
	});
}

var cleanBuildDirectory= function(directory){
	console.log('in ' + process.cwd());
	console.log('going to ' + path.join(directory,'build'));
	if(!fs.existsSync('build')) return;
	process.chdir('build');
	exec('git status -s',function(err, stdout, stderr){
		var changes = stdout.split('\n');
		changes.forEach(function(change){
			if(change.indexOf(' M ')===0 && change !== ' M Build.cmd')
				exec('git checkout ' + change.substr(3));
		});
	});
}

var updateAll = function(){
	var repositories = getDirectories();
	var baseDir = process.cwd();
	console.log("Running all updates -- please wait");
	repositories.forEach(function(repo){
		if(!fs.existsSync(repo.path)){ 
			mkdirp.sync(repo.path);
			git.clone(repo.url,repo.path,function(){
				updateDirectory(repo.path);
				cleanBuildDirectory(repo.path);
				process.chdir(baseDir);
			});
		}
		else {
			console.log('dir already there');
			console.log(repo.path);
			updateDirectory(repo.path);
			cleanBuildDirectory(repo.path);
			process.chdir(baseDir);
		}	
	});
}

fs.readAllLines = function(path){
	return fs.readFileSync(path,'utf8').split('\r\n');
}

var getDirectories = function(){
	var modules = [];
	fs.readAllLines('_rules/Modules.rule').forEach(function(line){
		modules.push({
			path :line.substring(0,line.lastIndexOf('=')).trim(),
			url :line.substring(line.lastIndexOf('=') + 1).trim()
		});
	});
	return modules;
}

updateAll();
