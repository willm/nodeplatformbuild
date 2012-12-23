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

	it("should should stash the project if there are changes", function(){
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb(true);});
		spyOn(fakeGit.stash, 'save');

		subject.update(project);

		expect(fakeGit.stash.save).toHaveBeenCalled();
	});
	
	it("should should not stash the project if there are no changes", function(){
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb(false);});
		spyOn(fakeGit.stash, 'save');

		subject.update(project);

		expect(fakeGit.stash.save).not.toHaveBeenCalled();
	});

});
