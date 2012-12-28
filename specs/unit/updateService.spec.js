var rewire = require('rewire'),
	path = require('path'),
	mocks = require('./mocks');

describe("update service", function() {
	var fakeFs, fakeRepo, subject;

	var project = {
		path: 'some/directory'
	};

	beforeEach(function(){
		fakeFs = mocks.fs;
		fakeCleaner = jasmine.createSpyObj('cleaner', ['clean']),
		fakeRepo = jasmine.createSpyObj('repo', ['checkout', 'branch', 'status', 'pull']);
		fakeRepo.stash = jasmine.createSpyObj('stash', ['save','pop']);

		subject = rewire('../../updateService.js');
		subject.__set__({
			fs: fakeFs,
			buildDirectoryCleaner: fakeCleaner
		});
	});

	it("should clean the project's build directory", function(){
		subject.update(fakeRepo);

		expect(fakeCleaner.clean).toHaveBeenCalledWith(fakeRepo);
	});
	
	it("should checkout the project's dependencies", function(){
		var dependencyPath = "lib";

		subject.update(fakeRepo);

		expect(fakeRepo.checkout).toHaveBeenCalledWith(dependencyPath);
	});

	it("should check which branch the project is on", function(){
		subject.update(fakeRepo);

		expect(fakeRepo.branch).toHaveBeenCalled();
	});

	it("should check if there are any changes", function(){
		fakeRepo.branch.andCallFake(function(cb){cb();});

		subject.update(fakeRepo);

		expect(fakeRepo.status).toHaveBeenCalled();
	});

	it("should should stash the project if there are changes", function(){
		fakeRepo.branch.andCallFake(function(cb){cb();});
		fakeRepo.status.andCallFake(function(cb){cb([" M something.js"]);});

		subject.update(fakeRepo);

		expect(fakeRepo.stash.save).toHaveBeenCalled();
	});
	
	it("should should not stash the project if there are no changes", function(){
		fakeRepo.branch.andCallFake(function(cb){cb();});
		fakeRepo.status.andCallFake(function(cb){cb([]);});

		subject.update(fakeRepo);

		expect(fakeRepo.stash.save).not.toHaveBeenCalled();
	});

	it("should should pull the project from the current branch if there are changes", function(){
		var branch = 'wibble';
		fakeRepo.branch.andCallFake(function(cb){cb(branch);});
		fakeRepo.status.andCallFake(function(cb){cb([" M something.js"]);});
		fakeRepo.stash.save.andCallFake(function(cb){cb();});

		subject.update(fakeRepo);

		expect(fakeRepo.pull).toHaveBeenCalledWith(branch,jasmine.any(Function));
	});
	it("should should pop the stash after pulling the project if there are changes", function(){
		var branch = 'wibble';
		fakeRepo.branch.andCallFake(function(cb){cb(branch);});
		fakeRepo.status.andCallFake(function(cb){cb([" M something.js"]);});
		fakeRepo.stash.save.andCallFake(function(cb){cb();});
		fakeRepo.pull.andCallFake(function(branch,cb){cb();});

		subject.update(fakeRepo);

		expect(fakeRepo.stash.pop).toHaveBeenCalled();
	});
	it("should pull from the current branch if there are no changes",function(){
		var branch = 'wibble';
		fakeRepo.branch.andCallFake(function(cb){cb(branch);});
		fakeRepo.status.andCallFake(function(cb){cb([]);});
		fakeRepo.stash.save.andCallFake(function(cb){cb();});

		subject.update(fakeRepo);

		expect(fakeRepo.pull).toHaveBeenCalledWith(branch);
	});
});
