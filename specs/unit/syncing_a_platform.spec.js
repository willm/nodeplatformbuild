var rewire = require('rewire');

describe("syncing a platform", function(){
		
	var Project = function(path, gitUrl){
		this.path = path;
		this.gitUrl = gitUrl;
		this.sync = function(){}
	}

	var subject = rewire('../../platform.js');
	var fakeProjects = jasmine.createSpyObj('projectList',['getAll']);
	var expectedProjects = [
		jasmine.createSpyObj('project', ['sync'])
	];

	fakeProjects.getAll.andReturn(expectedProjects);

	subject.__set__({
		projects : fakeProjects
	});

	it("should get all the projects", function(){
		subject.sync();

		expect(fakeProjects.getAll).toHaveBeenCalled();
	});

	it("should sync all the projects", function(){
		expectedProjects.forEach(function(proj){
			expect(proj.sync).toHaveBeenCalled();
		});
	});
});
