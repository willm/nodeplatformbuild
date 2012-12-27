exports.fs = {
	existsSync : function(path){},
	mkdirp : function(){}
};

exports.process = {
	cwd : function(){},
	chdir : function(){}
}

exports.git = {
	pull: function(){},
	clone: function(){},
	stash: {
		save:function(){},	
		pop:function(){}
	},
	status: function(){},
	branch: function(){},
};

exports.cloner = {
	clone : function(project){}
};

exports.updateService = {
	update : function(){}
};
