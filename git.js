var exec = require('child_process').exec,
	color = require('cli-color'),
	path = require('path'),
	os = require ('os');

var Git = function(repoPath){
	this.repoPath = repoPath;
};

Git.prototype.gitCommandExecute = function(command, opt ,cb){
	opt = opt || {};
	opt.print = opt.print!==false ;
	opt.stdOutParser = opt.stdOutParser || function(stdOut){return stdOut} ;
	opt.path = opt.path || this.repoPath;

	exec('git ' + command, {cwd: opt.path} ,function(err, stout, sterr){
		if(sterr) console.log(color.red('STERR: ' + sterr));
		if(err) console.log(color.red('Err: ' + err));
		if(stout && opt.print) console.log('Standard output: ' + stout);
		if(cb) cb(opt.stdOutParser(stout));
	});
}

Git.prototype.pull = function(branch, cb){
	var command = 'pull -q --recurse-submodules=yes -Xtheirs origin ' + branch;
	console.log('in dir ' +process.cwd()+' ' + command);
	this.gitCommandExecute(command,{} ,cb);
}

Git.prototype.stash = {
	save: function(message, cb){
	var command = 'stash save "' + message + '"'
		console.log(command);
		gitCommandExecute(command, {}, cb);
	},
	pop: function(cb){
		gitCommandExecute('stash pop', {}, cb);
	}
};
Git.prototype.status = function(cb){
	gitCommandExecute('status -s',{
		print: false, 
		stdOutParser:function(stdOut){
			return stdOut.split(os.EOL);
		}
	} ,cb);
}

Git.prototype.branch = function(cb){
	gitCommandExecute('branch', {
		stdOutParser: function(stdOut){
			return stdOut.substring(2); 
		}
	} ,cb);
}

Git.prototype.checkout = function(repoPath, cb){
	gitCommandExecute('checkout ' + repoPath, {},cb);
}

exports.clone = function(repo,repoPath,cb){
	var clone = 'clone ' + repo + ' ' + repoPath;
	var git = new Git(path.join(process.cwd(),repoPath));

	console.log(path.join(process.cwd(),repoPath));
	console.log('cloning:  ' + clone);
	console.log(repoPath);

	git.gitCommandExecute(clone,{path: process.cwd()},cb);
	return git;
}

exports.open = function(repoPath){
	return new Git(path.join(process.cwd(),repoPath));
};

