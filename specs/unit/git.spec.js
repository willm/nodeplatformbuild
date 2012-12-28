var rewire = require('rewire');

describe("git", function(){
	var subject = rewire('../../git2'),
		fakeExec = jasmine.createSpy();
	subject.__set__({
		exec: fakeExec
	});

	var path = "/some/path/to/a/repo";
	var git = subject.open(path);

	it("should open a new repo every time", function(){
		var pathB = "/some/path/to/a/repo";
		var gitB = subject.open(pathB);

		expect(git).not.toBe(gitB);
	});

	it("should execute commands with correct repo path",function(){
		git.pull('branch');

		expect(fakeExec).toHaveBeenCalledWith(jasmine.any(String), {cwd:path}, jasmine.any(Function));
	});
});
