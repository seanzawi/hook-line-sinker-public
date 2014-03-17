var path	= require('path'),
	spawn	= require('child_process').spawn
	;

module.exports = 
{
	start:function startServer(repository, commands)
	{
		var args = commands.split(' ').splice(1);
		var dir = path.join(__dirname, '../','hook-line-sinker-repo', repository);
		return spawn(commands.split(' ')[0], args, {cwd:dir});
	},
	stop: function stopServer(child_server)
	{
		child_server.kill();
	}
};