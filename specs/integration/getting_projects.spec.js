describe("projects",function(){

	it("should get all the projects in the modules rule file", function(){
		var subject = require('../../projects');

		var projects = subject.getAll();

		expect(projects.length).toEqual(3);
	});

});
