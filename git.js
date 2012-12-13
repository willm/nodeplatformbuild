var exec = require('child_process').exec,
	color = require('cli-color');

var gitCommandExecute = function(command, opt ,cb){
	opt = opt || {};
	opt.print = opt.print!==false ;

	exec('git ' + command, function(err, stout, sterr){
		if(sterr) console.log(color.red('STERR: ' + sterr));
		if(err) console.log(color.red('Err: ' + err));
		if(stout && opt.print) console.log('Standard output: ' + stout);
		if(cb) cb(stout);
	});
}

exports.pull = function(branch, cb){
	var command = 'pull -q --recurse-submodules=yes -Xtheirs origin ' + branch;
	console.log('in dir ' +process.cwd()+' ' + command);
	gitCommandExecute(command,{} ,cb);
}

exports.stash = {
	push: function(message, cb){
	var command = 'stash save "' + message + '"'
		console.log(command);
		gitCommandExecute(command, {}, cb);
	},
	pop: function(cb){
		gitCommandExecute('stash pop', {}, cb);
	}
}
exports.status = function(cb){
	gitCommandExecute('status -s',{print: false} ,cb);
}

exports.branch = function(cb){
	gitCommandExecute('branch', {} ,cb);
}

exports.checkout = function(path, cb){
	gitCommandExecute('checkout ' + path, {},cb);
}

exports.clone = function(repo,path,cb){
	var clone = 'clone ' + repo + ' ' + path;
	console.log('IN: ' + process.cwd() + ' ' +clone);
	gitCommandExecute(clone,{},cb)
}
