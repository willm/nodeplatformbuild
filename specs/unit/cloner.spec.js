var rewire = require('rewire'),
	mocks = require('./mocks');

describe("updater when project has not been cloned", function() {
	var fakeMkdirp, fakeGit, subject;

	var project = {
		path: 'some/directory',
		gitUrl : 'git@blah.com/bloo'
	};

	beforeEach(function(){
		fakeMkdirp = mocks.mkdirp;
		fakeGit = mocks.git;

		subject = rewire('../../cloner');
		subject.__set__({
			git : fakeGit,
			mkdirp : fakeMkdirp
		});
		
	})

	it("should create the project's path", function(){
		spyOn(fakeMkdirp, 'sync');

		subject.clone(project);

		expect(fakeMkdirp.sync).toHaveBeenCalledWith(project.path);

	});


	it("should should clone the project", function(){
		spyOn(fakeGit, 'clone');

		subject.clone(project);

		expect(fakeGit.clone).toHaveBeenCalledWith(project.gitUrl);
	});
});
