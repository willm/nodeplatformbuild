var rewire = require('rewire'),
	mocks = require('./mocks');


describe("updater when project previously been cloned", function() {
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

		spyOn(fakeFs, 'existsSync').andReturn(true);
	
	});

	it("should not clone the project", function(){
		spyOn(fakeCloner, 'clone');

		subject.syncProject(project);

		expect(fakeCloner.clone).wasNotCalled();

	});

	it("should update the project", function(){
		spyOn(fakeUpdateService, 'update');

		subject.syncProject(project);

		expect(fakeUpdateService.update).toHaveBeenCalled();	
	})
});
