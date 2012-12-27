var rewire = require('rewire'),
	path = require('path'),
	mocks = require('./mocks');

describe("update service", function() {
	var fakeFs, fakeGit, fakeProcess, subject;

	var project = {
		path: 'some/directory'
	};

	beforeEach(function(){
		fakeFs = mocks.fs;
		fakeGit = mocks.git;
		fakeProcess = mocks.process,
		fakeCleaner = jasmine.createSpyObj('cleaner', ['clean']);

		subject = rewire('../../updateService.js');
		subject.__set__({
			fs: fakeFs,
			git: fakeGit,
			process: fakeProcess,
			buildDirectoryCleaner: fakeCleaner
		});
	});

	it("should change to the project's directory", function(){
		var startDirectory = '/fg/f'
		spyOn(fakeProcess, 'chdir');
		spyOn(fakeProcess, 'cwd').andReturn(startDirectory);

		subject.update(project);

		expect(fakeProcess.chdir).toHaveBeenCalledWith(path.join(startDirectory, project.path));
	});
	
	it("should clean the project's build directory", function(){
		subject.update(project);

		expect(fakeCleaner.clean).toHaveBeenCalled();
	});
	
	it("should checkout the project's dependencies", function(){
		var dependencyPath = "lib";
		spyOn(fakeGit,'checkout');

		subject.update(project);

		expect(fakeGit.checkout).toHaveBeenCalledWith(dependencyPath);
	});

	it("should check which branch the project is on", function(){
		spyOn(fakeGit, 'branch');

		subject.update(project);

		expect(fakeGit.branch).toHaveBeenCalled();
	});

	it("should check if there are any changes", function(){
		spyOn(fakeGit, 'branch').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'status');

		subject.update(project);

		expect(fakeGit.status).toHaveBeenCalled();
	});

	it("should should stash the project if there are changes", function(){
		spyOn(fakeGit, 'branch').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb([" M something.js"]);});
		spyOn(fakeGit.stash, 'save');

		subject.update(project);

		expect(fakeGit.stash.save).toHaveBeenCalled();
	});
	
	it("should should not stash the project if there are no changes", function(){
		spyOn(fakeGit, 'branch').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb([]);});
		spyOn(fakeGit.stash, 'save');

		subject.update(project);

		expect(fakeGit.stash.save).not.toHaveBeenCalled();
	});

	it("should should pull the project from the current branch if there are changes", function(){
		var branch = 'wibble';
		spyOn(fakeGit, 'branch').andCallFake(function(cb){cb(branch);});
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb([" M something.js"]);});
		spyOn(fakeGit.stash, 'save').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'pull');

		subject.update(project);

		expect(fakeGit.pull).toHaveBeenCalledWith(branch,jasmine.any(Function));
	});
	it("should should pop the stash after pulling the project if there are changes", function(){
		var branch = 'wibble';
		spyOn(fakeGit, 'branch').andCallFake(function(cb){cb(branch);});
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb([" M something.js"]);});
		spyOn(fakeGit.stash, 'save').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'pull').andCallFake(function(branch,cb){cb();});
		spyOn(fakeGit.stash, 'pop');

		subject.update(project);

		expect(fakeGit.stash.pop).toHaveBeenCalled();
	});
	it("should pull from the current branch if there are no changes",function(){
		var branch = 'wibble';
		spyOn(fakeGit, 'branch').andCallFake(function(cb){cb(branch);});
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb([]);});
		spyOn(fakeGit.stash, 'save').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'pull');

		subject.update(project);

		expect(fakeGit.pull).toHaveBeenCalledWith(branch);
	});

	it("should change back to the original directory", function(){
		var startDirectory = '/';
		spyOn(fakeGit, 'branch').andCallFake(function(cb){cb('wibble');});
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb([]);});
		spyOn(fakeGit.stash, 'save').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'pull');
		spyOn(fakeProcess, 'chdir');
		spyOn(fakeProcess, 'cwd').andReturn(startDirectory);

		subject.update(project);

		expect(fakeProcess.chdir).toHaveBeenCalledWith(startDirectory);
	});
});
