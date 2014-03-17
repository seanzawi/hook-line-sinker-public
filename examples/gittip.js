var fs		= require('fs'),
	hdeps	= require('hacker-deps'),
	Hook	= require('../index.js'),
	path	= require('path')
	;

var hook = new Hook(
	{
		verbose:false,
		repo:
		[
			{url: 'git@github.com:seanzawi/personal-site.git', start: 'node index.js dev'},
			{url: 'git@github.com:seanzawi/hello-world.git', start: 'node index.js'}
		]
	});

hook.on('installed', function(server)
{
	var dir = path.join(__dirname, '../', 'hook-line-sinker-repo', server);
	hdeps(dir, function(err, result)
	{
		result.forEach(function(item, index)
		{
			result[index] = {name: item.name, percentage: (item.score*100).toFixed(2)};
			if(index===result.length-1)
				hook.emit('gittip', result);
		});
	});
});
hook.on('gittip', function(result)
{
	console.log(result);
});

hook.on('log', function(result)
{
	console.log(result);
});