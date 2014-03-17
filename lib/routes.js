var fs		= require('fs'),
	path	= require('path'),
	shell	= require('shelljs'),
	child	= require('child_process')
	;



module.exports = 
{
	ping: function (request, response)
	{
		var health =
		{
			'status':   'OK',
			'pid':      process.pid,
			'uptime':   process.uptime(),
			'ami':      process.env.EC2_AMI_ID,
			'instance': process.env.EC2_INSTANCE_ID,
		};
		response.json(health);
	},
	getRepo: function (req, res, next) 
	{
		var repoName	= req.params.name;
		var file		= path.join(__dirname, repoName)+ '.json';
		fs.readFile(file, function(err, data)
		{
			if(err)
			{
				res.status(400);
				res.end('Sorry, this file doesn\'t appear to exist');
				next(err);
			}
				res.end('Here\'s the info for - '+ repoName + ':\n\n '+ data);
		});
	},
	getResults: function (req, res, next)
	{
		var repo = req.params.name;
		var file = path.join(__dirname, '../results', repo)+ '.json';
		fs.readFile(file, function(err, data)
		{
			if(err)
			{
				console.log(err);
				res.status(400);
				res.end('Sorry, it looks like we don\'t have any test results for this repo');
				return next(err);
			}
				res.end('Here\'s the info for - '+ repo + ':\n\n '+ data);
		});
	},
	postRepo: function (req, res, next)
	{
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.send(200, "");
		res.end();
		next(req, res);
	},
	getList: function (req, res, next)
	{
		res.send(200, servers);
		next (req, res);
	}
};