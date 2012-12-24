exports.fs = {
	existsSync : function(path){}
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

exports.mkdirp = {
	sync : function(path){}
};

exports.cloner = {
	clone : function(project){}
};

exports.updateService = {
	update : function(){}
};
