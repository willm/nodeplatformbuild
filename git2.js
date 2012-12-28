var exec = require('child_process').exec,
	color = require('cli-color');

var Git = function(path){
	this.repoPath = path;
};

Git.prototype.gitCommandExecute = function(command, opt ,cb){
	opt = opt || {};
	opt.print = opt.print!==false ;
	opt.stdOutParser = opt.stdOutParser || function(stdOut){return stdOut} ;

	exec('git ' + command, {cwd: this.repoPath} ,function(err, stout, sterr){
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
			return stdOut.split('\n');
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

Git.prototype.checkout = function(path, cb){
	gitCommandExecute('checkout ' + path, {},cb);
}

Git.prototype.clone = function(repo,path,cb){
	var clone = 'clone ' + repo + ' ' + path;
	console.log('IN: ' + process.cwd() + ' ' +clone);
	gitCommandExecute(clone,{},cb)
}

exports.open = function(path){
	return new Git(path);
};

