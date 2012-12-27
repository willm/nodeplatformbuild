var fs = require('fs-extra'),
	path = require('path'),
	testDirectory = path.join(process.cwd(),'test');

describe('updater', function(){
	var removeTest = function(){
		fs.removeSync(testDirectory);
	};

	beforeEach(removeTest);

	afterEach(removeTest);

	it("should clone the repository to the expected path", function(){
		var subject = require('../../updater.js');
		var complete = false;
		var cloneComplete = function(){
			complete = true;
		};

		runs(function(){
			subject.syncProject({
				path: 'test',
				gitUrl: 'git@github.com:willm/WebHelper.git'
			}, cloneComplete);
		});

		waitsFor(function(){
			return complete;
		}, 20000);

		runs(function(){
			expect(fs.existsSync(path.join(testDirectory, '.git'))).toBe(true);
		});
	})
});
