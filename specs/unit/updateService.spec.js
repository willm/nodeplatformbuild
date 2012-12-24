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
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb(true);});
		spyOn(fakeGit.stash, 'save');

		subject.update(project);

		expect(fakeGit.stash.save).toHaveBeenCalled();
	});
	
	it("should should not stash the project if there are no changes", function(){
		spyOn(fakeGit, 'branch').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb(false);});
		spyOn(fakeGit.stash, 'save');

		subject.update(project);

		expect(fakeGit.stash.save).not.toHaveBeenCalled();
	});

	it("should should pull the project from the current branch if there are changes", function(){
		var branch = 'wibble';
		spyOn(fakeGit, 'branch').andCallFake(function(cb){cb(branch);});
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb(true);});
		spyOn(fakeGit.stash, 'save').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'pull');

		subject.update(project);

		expect(fakeGit.pull).toHaveBeenCalledWith(branch,jasmine.any(Function));
	});
	it("should should pop the stash after pulling the project if there are changes", function(){

		var branch = 'wibble';
		spyOn(fakeGit, 'branch').andCallFake(function(cb){cb(branch);});
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb(true);});
		spyOn(fakeGit.stash, 'save').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'pull').andCallFake(function(branch,cb){cb();});
		spyOn(fakeGit.stash, 'pop');

		subject.update(project);

		expect(fakeGit.stash.pop).toHaveBeenCalled();
	});
	it("should pull from the current branch if there are no changes",function(){
		var branch = 'wibble';
		spyOn(fakeGit, 'branch').andCallFake(function(cb){cb(branch);});
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb(false);});
		spyOn(fakeGit.stash, 'save').andCallFake(function(cb){cb();});
		spyOn(fakeGit, 'pull');

		subject.update(project);

		expect(fakeGit.pull).toHaveBeenCalledWith(branch);
	});
});
