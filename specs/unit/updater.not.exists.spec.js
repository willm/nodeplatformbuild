var rewire = require('rewire'),
	mocks = require('./mocks');

describe("updater when project has not been cloned", function() {
	var fakeFs, fakeCloner, fakeUpdateService, subject;

	var project = {
		path: 'some/directory'
	};

	beforeEach(function(){
		fakeFs = mocks.fs;
		fakeCloner = mocks.cloner;
		fakeUpdateService = mocks.updateService;

		subject = rewire('../../updater.js');
		subject.__set__({
			fs: fakeFs,
			cloner: fakeCloner,
			updateService: fakeUpdateService
		});
		
	})

	it("should check if git the directory exists", function() {
		spyOn(fakeFs,'existsSync');

		subject.syncProject(project);

		expect(fakeFs.existsSync).toHaveBeenCalledWith(project.path + '/.git');
	});

	it("should should clone the project if directory does not exit", function(){
		spyOn(fakeFs,'existsSync').andReturn(false);
		spyOn(fakeCloner, 'clone');

		subject.syncProject(project);

		expect(fakeCloner.clone).toHaveBeenCalledWith(project, undefined);
	});
	
	it("should should not update the project when directory does not exist", function(){
		spyOn(fakeFs,'existsSync').andReturn(false);
		spyOn(fakeUpdateService, 'update');

		subject.syncProject(project);

		expect(fakeUpdateService.update).wasNotCalled();
	});
});
