var rewire = require('rewire'),
	path = require('path');

describe("git", function(){
	var subject,
		fakeExec,
		fakeProcess = jasmine.createSpyObj('process',['cwd']),
		currentDir = '/blah',
		repoPath = "/some/path/to/a/repo",
		git,
		subject;

	beforeEach(function(){
		fakeExec = jasmine.createSpy(),
		subject = rewire('../../git');
		subject.__set__({
			exec: fakeExec,
			process: fakeProcess
		});
	});

	fakeProcess.cwd.andReturn(currentDir);


	it("should open a new repo every time", function(){
		var pathB = "/some/path/to/a/repo";
		var gitB = subject.open(pathB);
		git = subject.open(repoPath);

		expect(git).not.toBe(gitB);
	});

	it("should execute commands with correct repo path",function(){
		git = subject.open(repoPath);

		git.pull('branch');

		expect(fakeExec).toHaveBeenCalledWith(jasmine.any(String), {cwd:path.join(currentDir,repoPath)}, jasmine.any(Function));
	});

	it("should clone the repository", function(){
		var gitUrl = 'git@gitetygit.com/blah',
			repoPath = 'a/path',
			clonned = subject.clone(gitUrl, repoPath);
		
		expect(fakeExec).toHaveBeenCalledWith("git clone " + gitUrl + " " + repoPath, {cwd: currentDir}, jasmine.any(Function));
	});
});
