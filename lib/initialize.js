module.exports = function(repositories, cb)
{
	var fs		= require('fs'),
		git		= require('gift'),
		path	= require('path')
		;

	var directory	= path.join(__dirname,'../', 'hook-line-sinker-repo');

	fs.exists(directory, function(exists)
	{
		if(!exists)
			fs.mkdir(directory);
		Object.keys(repositories).forEach(function(repo, index)
		{
			var dir = path.join(directory, repo);
			fs.exists(dir, function(exists)
			{
				if(exists)
				{
					cb(repo);					
				}
				else
				{
					git.clone(repositories[repo].url, dir, function(err, result)
					{
						console.log(repo);
						cb(repo);
					});
				}
			});
		});
	});
};