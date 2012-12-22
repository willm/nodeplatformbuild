var rewire = require('rewire'),
	mocks = require('./mocks');

describe("update service", function() {
	var fakeFs, fakeGit, fakeProcess, subject;

	var project = {
		path: 'some/directory'
	};

	beforeEach(function(){
		fakeFs = mocks.fs;
		fakeGit = mocks.git;
		fakeProcess = mocks.process;

		subject = rewire('../../updateService.js');
		subject.__set__({
			fs: fakeFs,
			git: fakeGit,
			process: fakeProcess
		});
	});

	it("should change to the project's directory", function(){
		spyOn(fakeProcess, 'chdir');

		subject.update(project);

		expect(fakeProcess.chdir).toHaveBeenCalledWith(project.path);
	});
	
	it("should check if there are any changes", function(){
		spyOn(fakeGit, 'status');

		subject.update(project);

		expect(fakeGit.status).toHaveBeenCalled();
	});

	it("should should pull the project if there are changes", function(){
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'pull');

		subject.update(project);

		expect(fakeGit.pull).toHaveBeenCalled();
	});
});
