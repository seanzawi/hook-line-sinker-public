var assert		= require('assert'),
	path		= require('path'),
	shellParse	= require('shell-quote').parse,
	spawn		= require('child_process').spawn
	;

module.exports =
{
	start:function startServer(repository, commands, basePath)
	{
		var args = shellParse(commands);
		args.forEach(function(arg)
		{
			assert(typeof arg == 'string', 'The `commands` string must not contain non-string components.');
		});
		var dir = path.join(basePath,'hook-line-sinker-repo', repository);
		return spawn(args.shift(), args, {cwd:dir});
	},
	stop: function stopServer(child_server)
	{
		child_server.kill();
	}
};