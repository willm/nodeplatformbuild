var fs = require('fs'),
	path = require('path'),
	color = require('cli-color'),
	buildDirectoryCleaner = require('./buildDirectoryCleaner');

var stashPullPop = function (changes, branch, repo) {
	if (changes.length !== 0) {
		repo.stash.save(function () {
			console.log(color.blue('Changes will be stashed and re-applied'));
			repo.pull(branch, function () {
				repo.stash.pop();
			});
		});
	} else {
		console.log(color.blue('No local changes'));
		repo.pull(branch);
	}
};

var updateDependencies = function(repo){
	//TODO: change this to read from the dependency rule
	var dependencyPath = "lib";
	repo.checkout(dependencyPath);
};

exports.update = function (repo, cb) {
	updateDependencies(repo);
	buildDirectoryCleaner.clean(repo);

	repo.branch(function (branch) {
		console.log(color.cyan("Updating " + repo.repoPath  + " to latest " + branch));
		repo.status(function(changes){
			stashPullPop(changes, branch, repo);
		});

		if (cb) {
			cb();
		}
	});
};
