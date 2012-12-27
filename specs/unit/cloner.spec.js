var rewire = require('rewire'),
	mocks = require('./mocks');

describe("updater when project has not been cloned", function() {
	var fakeFs, fakeGit, subject;

	var project = {
		path: 'some/directory',
		gitUrl : 'git@blah.com/bloo'
	};

	beforeEach(function(){
		fakeFs = mocks.fs;
		fakeGit = mocks.git;

		subject = rewire('../../cloner');
		subject.__set__({
			git : fakeGit,
			fs : fakeFs
		});
		
	})

	it("should create the project's path", function(){
		spyOn(fakeFs, 'mkdirp');

		subject.clone(project);

		expect(fakeFs.mkdirp).toHaveBeenCalledWith(project.path, jasmine.any(Function));

	});


	it("should should clone the project", function(){
		spyOn(fakeFs, 'mkdirp').andCallFake(function(path, cb){cb();});
		spyOn(fakeGit, 'clone');

		subject.clone(project);

		expect(fakeGit.clone).toHaveBeenCalledWith(project.gitUrl, project.path, jasmine.any(Function));
	});
});
