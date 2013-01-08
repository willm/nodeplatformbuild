var rewire = require('rewire'),
	mocks = require('./mocks');

describe("updater when project has not been cloned", function() {
	var fakeFs, fakeCloner, fakeUpdateService, subject, fakeGit;

	beforeEach(function(){
		fakeFs = mocks.fs;
		fakeCloner = mocks.cloner;
		fakeUpdateService = mocks.updateService;
		fakeGit = jasmine.createSpyObj('git', ['open']),
		fakeRepo = {},

		Project = rewire('../../project.js');

		fakeGit.open.andReturn(fakeRepo);
		Project.__set__({
			git: fakeGit,
			fs: fakeFs,
			cloner: fakeCloner,
			updateService: fakeUpdateService
		});
		
		subject = new Project('some/directory', 'git@yomamam.com/git');
	})

	it("should check if git the directory exists", function() {
		spyOn(fakeFs,'existsSync');

		subject.sync();

		expect(fakeFs.existsSync).toHaveBeenCalledWith(subject.path + '/.git');
	});

	it("should should clone the project if directory does not exit", function(){
		spyOn(fakeFs,'existsSync').andReturn(false);
		spyOn(fakeCloner, 'clone');

		subject.sync();

		expect(fakeCloner.clone).toHaveBeenCalledWith(subject, undefined);
	});
	
	it("should should not update the project when directory does not exist", function(){
		spyOn(fakeFs,'existsSync').andReturn(false);
		spyOn(fakeUpdateService, 'update');

		subject.sync();

		expect(fakeUpdateService.update).wasNotCalled();
	});
	
	it("should not clone the project", function(){
		spyOn(fakeFs,'existsSync').andReturn(true);
		spyOn(fakeCloner, 'clone');

		subject.sync();

		expect(fakeCloner.clone).wasNotCalled();

	});

	it("should update the project", function(){
		spyOn(fakeFs,'existsSync').andReturn(true);
		spyOn(fakeUpdateService, 'update');

		subject.sync();

		expect(fakeUpdateService.update).toHaveBeenCalledWith(fakeRepo, undefined);
	});
});
