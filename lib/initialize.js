var async	= require('async'),
	fs		= require('fs'),
	git		= require('gift'),
	path	= require('path')
	;

module.exports = function(repositories, cb)
{
	var directory	= path.join(__dirname,'../', 'hook-line-sinker-repo');

	fs.exists(directory, function(exists)
	{
		if(!exists)
			fs.mkdir(directory, ensureRepos);
		else
			ensureRepos();
	});

	function ensureRepos(err)
	{
		if(err)
			return cb(err);

		var repo_names = Object.keys(repositories);
		async.map(repo_names, function(repo, next)
		{
			var dir = path.join(directory, repo);
			fs.exists(dir, function(exists)
			{
				if (exists)
					return next(null, repo);

				git.clone(repositories[repo].url, dir, function(err, result)
				{
					if (err)
						return next(err);

					next(null, repo);
				});
			});
		}, cb);
	}
};