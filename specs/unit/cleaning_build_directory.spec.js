var rewire = require('rewire'),
	mocks = require('./mocks'),
	path = require('path');

describe('clean build directory', function() {
	var subject = rewire('../../updater.js'),
		projectDirectory = 'priject/dir';
		fakeFs = mocks.fs,
		fakeUpdateService = mocks.updateService,
		fakeCloner = mocks.cloner;
		fakeProcess = mocks.process,
		fakeGit = mocks.git;

	subject.__set__({
		fs: fakeFs,
		updateService: fakeUpdateService,
		cloner: fakeCloner,
		process: fakeProcess,
		git: fakeGit
	});

	it("should return if build directory does not exist", function(){
		spyOn(fakeFs, 'existsSync').andReturn(false);
		spyOn(fakeProcess, 'chdir');

		subject.cleanBuildDirectory(projectDirectory);

		expect(fakeProcess.chdir).not.toHaveBeenCalled();
	});

	it("should change to the build directory", function(){
		spyOn(fakeFs, 'existsSync').andReturn(true);
		spyOn(fakeProcess, 'chdir');

		subject.cleanBuildDirectory(projectDirectory);

		expect(fakeProcess.chdir).toHaveBeenCalledWith('build');
	});

	
	it("should check for changes", function(){
		spyOn(fakeFs, 'existsSync').andReturn(true);
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb([]);});

		subject.cleanBuildDirectory(projectDirectory);

		expect(fakeGit.status).toHaveBeenCalled();
	});

	it("should checkout modified files", function(){
		spyOn(fakeFs, 'existsSync').andReturn(true);
		var fileName = 'something.js';
		var anotherFileName = 'something.js';
		spyOn(fakeGit, 'status').andCallFake(function(cb){
			cb([' M ' + fileName, ' M ' + anotherFileName]);
		});
		spyOn(fakeGit, 'checkout');

		subject.cleanBuildDirectory(projectDirectory);

		expect(fakeGit.checkout).toHaveBeenCalledWith(fileName);
		expect(fakeGit.checkout).toHaveBeenCalledWith(anotherFileName);
	});


	it("should not checkout unmodified files", function(){
		spyOn(fakeFs, 'existsSync').andReturn(true);
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb([" ? change.js"]);});
		spyOn(fakeGit, 'checkout');

		subject.cleanBuildDirectory(projectDirectory);

		expect(fakeGit.checkout).not.toHaveBeenCalled();
	});
	
	it("should not checkout Build.cmd", function(){
		spyOn(fakeFs, 'existsSync').andReturn(true);
		spyOn(fakeGit, 'status').andCallFake(function(cb){cb([" M Build.cmd"]);});
		spyOn(fakeGit, 'checkout');

		subject.cleanBuildDirectory(projectDirectory);

		expect(fakeGit.checkout).not.toHaveBeenCalled();
	});

	it("should not checkout files in directories above", function(){
		spyOn(fakeFs, 'existsSync').andReturn(true);

		spyOn(fakeGit, 'status').andCallFake(function(cb){cb([" M ../somefile.js"]);});
		spyOn(fakeGit, 'checkout');

		subject.cleanBuildDirectory(projectDirectory);

		expect(fakeGit.checkout).not.toHaveBeenCalled();
	});

});
