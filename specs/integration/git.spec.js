var git = require('../../git.js'),
	path = require('path'),
	fs = require('fs-extra');

describe("git", function() {
	var testDir = path.join(process.cwd(),'test');
	var removeTest = function(){
		fs.removeSync(testDir);
	};

	beforeEach(removeTest);

	afterEach(removeTest);

	it("should clone", function() {
		var complete = false;
		fs.mkdirSync(testDir);

		runs(function(){
			git.clone('git@github.com:willm/WebHelper.git',testDir,function(){
				complete = true;
			});
		});
		
		waitsFor(function(){
			return complete;
		}, 20000);

		runs(function(){
			expect(fs.existsSync(path.join(testDir,'src'))).toBe(true);
		});
	});
});
