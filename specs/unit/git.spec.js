var rewire = require('rewire'),
	path = require('path');

describe("git", function(){
	var subject = rewire('../../git2'),
		fakeExec = jasmine.createSpy(),
		fakeProcess = jasmine.createSpyObj('process',['cwd']),
		currentDir = '/blah',
		repoPath = "/some/path/to/a/repo",
		git;

	fakeProcess.cwd.andReturn(currentDir);
	subject.__set__({
		exec: fakeExec,
		process: fakeProcess
	});

	git = subject.open(repoPath);

	it("should open a new repo every time", function(){
		var pathB = "/some/path/to/a/repo";
		var gitB = subject.open(pathB);

		expect(git).not.toBe(gitB);
	});

	it("should execute commands with correct repo path",function(){
		git.pull('branch');

		expect(fakeExec).toHaveBeenCalledWith(jasmine.any(String), {cwd:path.join(currentDir,repoPath)}, jasmine.any(Function));
	});

	it("should clone the repository", function(){
		var gitUrl = 'git@gitetygit.com/blah',
			repoPath = 'a/path',
			clonned = subject.clone(gitUrl, repoPath);
		
		expect(fakeExec).toHaveBeenCalledWith("git clone " + gitUrl, {cwd:path.join(currentDir,repoPath)}, jasmine.any(Function));
	});
});
