var fs = require('fs'),
	git = require('./git'),
	path = require('path'),
	color = require('cli-color'),
	buildDirectoryCleaner = require('./buildDirectoryCleaner');

var stashPullPop = function (changes, branch) {
	if (changes.length !== 0) {
		git.stash.save(function () {
			console.log(color.blue('Changes will be stashed and re-applied'));
			git.pull(branch, function () {
				git.stash.pop();
			});
		});
	} else {
		console.log(color.blue('No local changes'));
		git.pull(branch);
	}
};

exports.update = function (project, cb) {
	var startDirectory = process.cwd();
	process.chdir(path.join(startDirectory, project.path));

	buildDirectoryCleaner.clean();

	git.branch(function (branch) {
		console.log(color.cyan("Updating " + startDirectory + " to latest " + branch));
		git.status(function(changes){
			stashPullPop(changes, branch);
		});

		process.chdir(startDirectory);

		if (cb) {
			cb();
		}
	});
};
