var rewire = require('rewire'),
	path = require('path');

describe('clean build directory', function() {
	var subject = rewire('../../buildDirectoryCleaner.js'),
		projectDirectory = 'project/dir',
		fakeFs = jasmine.createSpyObj('fs', ['existsSync']),
		fakeRepo,
		repoPath;

	subject.__set__({
		fs: fakeFs
	});

	beforeEach(function(){
		repoPath = '/bla/';
		fakeRepo = jasmine.createSpyObj('repo', ['status','checkout']);
		fakeRepo.repoPath = repoPath;
	});

	it("should check whether the build folder exists", function(){
		subject.clean(fakeRepo);

		expect(fakeFs.existsSync).toHaveBeenCalledWith(path.join(repoPath, 'build'));
	});

	it("should return if build directory does not exist", function(){
		fakeFs.existsSync.andReturn(false);

		subject.clean(fakeRepo);

		expect(fakeRepo.status).not.toHaveBeenCalled();
	});

	it("should check for changes", function(){
		fakeFs.existsSync.andReturn(true);

		subject.clean(fakeRepo);

		expect(fakeRepo.status).toHaveBeenCalled();
	});

	it("should checkout modified files", function(){
		var anotherFileName = 'build/something.js';
		var fileName = 'build/something.js';
		fakeFs.existsSync.andReturn(true);
		fakeRepo.status.andCallFake(function(cb){
			cb([' M ' + fileName, ' M ' + anotherFileName]);
		});

		subject.clean(fakeRepo);

		expect(fakeRepo.checkout).toHaveBeenCalledWith(fileName);
		expect(fakeRepo.checkout).toHaveBeenCalledWith(anotherFileName);
	});


	it("should not checkout unmodified files", function(){
		fakeFs.existsSync.andReturn(true);
		fakeRepo.status.andCallFake(function(cb){cb([" ? build/change.js"]);});

		subject.clean(fakeRepo);

		expect(fakeRepo.checkout).not.toHaveBeenCalled();
	});
	
	it("should not checkout Build.cmd", function(){
		fakeFs.existsSync.andReturn(true);
		fakeRepo.status.andCallFake(function(cb){cb([" M build/Build.cmd"]);});

		subject.clean(fakeRepo);

		expect(fakeRepo.checkout).not.toHaveBeenCalled();
	});

	it("should not checkout files in directories not in build folder", function(){
		fakeFs.existsSync.andReturn(true);

		fakeRepo.status.andCallFake(function(cb){cb([" M somefile.js"]);});

		subject.clean(fakeRepo);

		expect(fakeRepo.checkout).not.toHaveBeenCalled();
	});

});
