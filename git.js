var exec = require('child_process').exec;

exports.pull = function(){
	exec('git pull -q --recurse-submodules=yes -Xtheirs origin "$currentBranch"',function(err, stout, sterr){
		console.log(sterr);
	});
}

exports.clone = function(repo,path,cb){
	var command = 'git clone ' + repo + ' ' + repo;
	console.log(command);
	exec(command, function(err, stout, sterr){
		console.log('STERR: ' + sterr);
		console.log('Err: ' + err);
		console.log('STDOUT' + stout);
		if(cb) cb();
	});
}
