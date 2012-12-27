var git = require('../../git.js'),
	path = require('path'),
	fs = require('fs');

describe("git", function() {
	var testDir = path.join(process.cwd(),'test');
	afterEach(function(){
		fs.rmdir(testDir);
	});

	it("should clone", function() {
		fs.mkdirSync(testDir);

		git.clone('git@github.com:willm/WebHelper.git',testDir,function(){
			expect(fs.existsSync('src')).toBe(true);
			fs.rmdir(testDir);
		});
	});
});
